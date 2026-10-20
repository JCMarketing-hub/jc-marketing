/**
 * Verificação do build em dist/: links e recursos internos, âncoras, SEO
 * básico e aviso de exemplo fictício nas páginas de exemplo.
 * Uso: npm run build && npm run check (use o mesmo BASE_PATH nos dois).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, posix } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const errors = [];

if (!existsSync(dist)) {
  console.error('dist/ não encontrado. Rode "npm run build" antes.');
  process.exit(1);
}

const htmlFiles = walk(dist).filter((f) => f.endsWith('.html'));
const pages = new Map(htmlFiles.map((f) => [toUrlPath(f), readFileSync(f, 'utf8')]));

for (const [pagePath, html] of pages) {
  const label = pagePath;
  if (!/<html lang="pt-BR">/.test(html)) errors.push(`${label}: falta lang="pt-BR".`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${label}: falta <title>.`);
  if (!/<meta\s+name="description"/.test(html)) errors.push(`${label}: falta meta description.`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${label}: esperado 1 <h1>, encontrado ${h1}.`);
  if (/\{\{\w+\}\}|<!--\s*@(include|seo|contacts|social|whatsapp-float)/.test(html)) {
    errors.push(`${label}: marcador de template não processado.`);
  }
  if (pagePath.includes('/projetos/') && !/Exemplo fictício/.test(html)) {
    errors.push(`${label}: falta o aviso de exemplo fictício.`);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) errors.push(`${label}: imagem sem alt: ${m[0]}`);
  }

  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(raw) || raw === '') continue;
    const [pathPart, hash] = raw.split('#');
    // pagePath termina em "/" (ou no nome do arquivo); o "x" mantém o diretório correto.
    // posix.resolve remove a barra final, que precisa ser mantida.
    let target = pathPart ? posix.resolve(posix.dirname(pagePath + 'x'), pathPart) : pagePath;
    if (pathPart.endsWith('/') && !target.endsWith('/')) target += '/';
    if (pathPart && !target.startsWith(base)) {
      errors.push(`${label}: ${attr}="${raw}" fora do caminho base ${base}.`);
      continue;
    }
    const file = resolveFile(target);
    if (!file) {
      errors.push(`${label}: ${attr}="${raw}" não encontrado.`);
      continue;
    }
    if (hash) {
      const targetHtml = pages.get(toUrlPath(file));
      if (targetHtml && !new RegExp(`id="${hash}"`).test(targetHtml)) {
        errors.push(`${label}: âncora "#${hash}" não existe em ${toUrlPath(file)}.`);
      }
    }
  }
}

for (const required of ['robots.txt', '.nojekyll', 'favicon.png', 'apple-touch-icon.png', 'og-image.jpg', '404.html']) {
  if (!existsSync(join(dist, required))) errors.push(`dist/${required} ausente.`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s) encontrado(s):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log(`✓ ${pages.size} páginas verificadas (base ${base}). Links, âncoras e SEO básico OK.`);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function toUrlPath(file) {
  const rel = relative(dist, file).split('\\').join('/');
  return base + rel.replace(/(^|\/)index\.html$/, '$1');
}

function resolveFile(urlPath) {
  const rel = urlPath.slice(base.length);
  const candidates = [rel, join(rel, 'index.html')];
  for (const c of candidates) {
    const full = join(dist, c);
    if (existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
}
