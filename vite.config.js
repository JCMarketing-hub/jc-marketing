import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import site from './site.config.js';

const root = dirname(fileURLToPath(import.meta.url));

// Caminho base: "/" localmente ou em domínio próprio; "/<repositorio>/" em
// sites de projeto do GitHub Pages (definido pelo workflow via BASE_PATH).
const base = withTrailingSlash(process.env.BASE_PATH || '/');
// URL pública absoluta (ex.: https://usuario.github.io/repositorio). Opcional:
// sem ela, canonical, og:url e sitemap são omitidos.
const siteUrl = (process.env.SITE_URL || '').replace(/\/+$/, '');

// Páginas publicadas (caminhos relativos ao base). A 404 fica fora do sitemap.
const pages = {
  main: { file: 'index.html', path: '/' },
  burger: { file: 'projetos/burger-house/index.html', path: '/projetos/burger-house/' },
  autotech: { file: 'projetos/autotech/index.html', path: '/projetos/autotech/' },
  belle: { file: 'projetos/studio-belle/index.html', path: '/projetos/studio-belle/' },
  notFound: { file: '404.html', path: null },
};

function withTrailingSlash(p) {
  return p.endsWith('/') ? p : `${p}/`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function absoluteUrl(path) {
  return `${siteUrl}${base.replace(/\/$/, '')}${path}`.replace(/([^:]\/)\/+/g, '$1');
}

function contactLinks() {
  const c = site.contact;
  const items = [];
  if (c.whatsapp) {
    items.push(
      `<li><a class="contact-link" href="https://wa.me/${escapeHtml(c.whatsapp.replace(/\D/g, ''))}" target="_blank" rel="noopener">WhatsApp</a></li>`,
    );
  }
  if (c.email) {
    items.push(
      `<li><a class="contact-link" href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></li>`,
    );
  }
  if (c.phone) {
    // Números nacionais (DDD + número) recebem o DDI do Brasil no link.
    let tel = c.phone.replace(/[^\d+]/g, '');
    if (!tel.startsWith('+')) tel = tel.length <= 11 ? `+55${tel}` : `+${tel}`;
    items.push(
      `<li><a class="contact-link" href="tel:${escapeHtml(tel)}">${escapeHtml(c.phone)}</a></li>`,
    );
  }
  if (c.region) {
    items.push(`<li class="contact-text">${escapeHtml(c.region)}</li>`);
  }
  if (!items.length) {
    return '<p class="config-notice">Os canais de atendimento estão sendo configurados. Em breve você poderá falar com a gente por aqui.</p>';
  }
  return `<ul class="contact-list" role="list">${items.join('')}</ul>`;
}

const socialIcons = {
  instagram: {
    label: 'Instagram',
    path: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>',
  },
  linkedin: {
    label: 'LinkedIn',
    path: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v6M8 7.5v.01M12 16v-3.5a2 2 0 0 1 4 0V16M12 10v6"/>',
  },
  facebook: {
    label: 'Facebook',
    path: '<path d="M14 8h2.5V4.5H14A3.5 3.5 0 0 0 10.5 8v2.5H8V14h2.5v6.5H14V14h2.5l.5-3.5h-3V8.5A.5.5 0 0 1 14 8z"/>',
  },
};

function socialLinks() {
  const items = Object.entries(site.social)
    .filter(([key, url]) => url && socialIcons[key])
    .map(([key, url]) => {
      const { label, path } = socialIcons[key];
      return `<li><a class="social-link" href="${escapeHtml(url)}" target="_blank" rel="noopener" aria-label="${label} da ${escapeHtml(site.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg></a></li>`;
    });
  return items.length ? `<ul class="footer-social" role="list">${items.join('')}</ul>` : '';
}

function seoTags(path) {
  if (!siteUrl) return '';
  const url = absoluteUrl(path);
  return `<link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />`;
}

function renderHtml(html, depth = 0) {
  if (depth > 5) throw new Error('Includes aninhados demais.');
  return html
    .replace(/<!--\s*@include\s+([\w-]+)\s*-->/g, (_, name) =>
      renderHtml(readFileSync(resolve(root, 'src/partials', `${name}.html`), 'utf8'), depth + 1),
    )
    .replace(/<!--\s*@seo\s+path="([^"]+)"\s*-->/g, (_, path) => seoTags(path))
    .replace(/<!--\s*@contacts\s*-->/g, contactLinks)
    .replace(/<!--\s*@social\s*-->/g, socialLinks)
    .replace(/\{\{base\}\}/g, base)
    .replace(/\{\{name\}\}/g, escapeHtml(site.name))
    .replace(/\{\{year\}\}/g, String(new Date().getFullYear()));
}

function jcSitePlugin() {
  return {
    name: 'jc-site',
    transformIndexHtml: { order: 'pre', handler: (html) => renderHtml(html) },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /'];
      if (siteUrl) robots.push(`Sitemap: ${absoluteUrl('/sitemap.xml')}`);
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` });

      if (siteUrl) {
        const urls = Object.values(pages)
          .filter((p) => p.path)
          .map((p) => `  <url><loc>${absoluteUrl(p.path)}</loc></url>`)
          .join('\n');
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
      }
      // Desativa o processamento Jekyll do GitHub Pages.
      this.emitFile({ type: 'asset', fileName: '.nojekyll', source: '' });
    },
  };
}

export default defineConfig({
  base,
  plugins: [jcSitePlugin()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(pages).map(([key, p]) => [key, resolve(root, p.file)]),
      ),
    },
  },
});
