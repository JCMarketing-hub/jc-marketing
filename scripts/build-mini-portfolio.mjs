/**
 * Gera o mini portfólio em PDF (A4, 3 páginas) a partir de
 * materiais/mini-portfolio/mini-portfolio.html, com os contatos de site.config.js.
 * Uso: npm run mini-portfolio
 * Variável opcional CHROME_PATH aponta para o Chrome/Edge.
 */
import { PDFDocument, PDFName } from 'pdf-lib';
import sharp from 'sharp';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, rmSync, statSync, mkdtempSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import site from '../site.config.js';

const EXPECTED_PAGES = 3;
const sourceDir = resolve('materiais/mini-portfolio');
const template = join(sourceDir, 'mini-portfolio.html');
const rendered = join(sourceDir, '.render.html');
const output = resolve('materiais/mini-portfolio-narkia-digital.pdf');

const chrome =
  process.env.CHROME_PATH ||
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].find((p) => existsSync(p));

if (!chrome) fail('Chrome/Edge não encontrado. Defina CHROME_PATH.');

const { whatsapp, email, phone } = site.contact;
if (!whatsapp || !email || !phone || !site.url) {
  fail('Preencha url, contact.whatsapp, contact.email e contact.phone em site.config.js.');
}

// As telas viram JPEG: em PDF, imagens WebP são embutidas sem perdas e pesam muito mais.
const imgDir = join(sourceDir, '.img');
mkdirSync(imgDir, { recursive: true });
for (const name of ['autotech-desktop', 'autotech-mobile', 'burger-house-desktop', 'studio-belle-desktop']) {
  await sharp(resolve('src/assets/img/telas', `${name}.webp`))
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(join(imgDir, `${name}.jpg`));
}

const escape = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const message = `Olá, ${site.name}! Vi o mini portfólio e gostaria de conversar sobre o meu negócio.`;
const values = {
  img: '.img',
  logo: '../../src/assets/brand/narkia-logo.png',
  name: site.name,
  siteUrl: site.url,
  siteLabel: site.url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
  whatsappUrl: `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
  phone,
  email,
  year: new Date().getFullYear(),
};

let html = readFileSync(template, 'utf8').replace(/\{\{(\w+)\}\}/g, (match, key) =>
  key in values ? escape(values[key]) : match,
);
const leftover = html.match(/\{\{\w+\}\}/);
if (leftover) fail(`Marcador sem valor: ${leftover[0]}`);
// Imagens trocadas de .webp para as cópias em JPEG.
html = html.replace(/(\.img\/[\w-]+)\.webp/g, '$1.jpg');
writeFileSync(rendered, html);

const profile = mkdtempSync(join(tmpdir(), 'jc-pdf-'));

// 1) Confere se algum conteúdo passa da folha (o HTML marca body[data-overflow]).
const dom = spawnSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    `--user-data-dir=${profile}`,
    '--window-size=794,1123',
    '--virtual-time-budget=10000',
    '--dump-dom',
    pathToFileURL(rendered).href,
  ],
  { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 },
);
const overflow = dom.stdout.match(/data-overflow="([^"]*)"/)?.[1];
if (!overflow) fail('Não foi possível verificar cortes de conteúdo.');
if (overflow !== 'none') {
  cleanup();
  fail(`Conteúdo ultrapassa a folha em: ${overflow}.`);
}

// 2) Gera o PDF.
const result = spawnSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    `--user-data-dir=${profile}`,
    '--no-pdf-header-footer',
    '--virtual-time-budget=10000',
    `--print-to-pdf=${output}`,
    pathToFileURL(rendered).href,
  ],
  { stdio: 'inherit' },
);
cleanup();
if (result.status !== 0 || !existsSync(output)) fail('O Chrome não gerou o PDF.');

// Confere páginas, tamanho A4 e links; grava metadados.
const pdf = await PDFDocument.load(readFileSync(output));
const pages = pdf.getPages();
if (pages.length !== EXPECTED_PAGES) fail(`O PDF tem ${pages.length} páginas; esperado ${EXPECTED_PAGES}.`);
for (const [i, page] of pages.entries()) {
  const { width, height } = page.getSize();
  if (Math.abs(width - 595.3) > 2 || Math.abs(height - 841.9) > 2) {
    fail(`Página ${i + 1} fora do A4: ${width.toFixed(1)} × ${height.toFixed(1)} pt.`);
  }
}

const links = [];
for (const [i, page] of pages.entries()) {
  const annots = page.node.Annots();
  for (const ref of annots ? annots.asArray() : []) {
    const action = pdf.context.lookup(ref).lookup(PDFName.of('A'));
    const uri = action?.lookup(PDFName.of('URI'));
    if (uri) links.push(`p${i + 1}: ${decodeURIComponent(uri.decodeText?.() ?? uri.toString())}`);
  }
}

pdf.setTitle(`${site.name} — Mini portfólio`);
pdf.setAuthor(site.name);
pdf.setSubject('Sites, páginas de divulgação, cardápios on-line, artes e informações no Google.');
pdf.setLanguage('pt-BR');
pdf.setCreator(site.name);
pdf.setProducer(site.name);
writeFileSync(output, await pdf.save());

const sizeKb = statSync(output).size / 1024;
console.log(`✓ ${output}`);
console.log(`✓ ${pages.length} páginas A4 · ${sizeKb.toFixed(0)} KB`);
links.forEach((l) => console.log(`  link ${l}`));

function cleanup() {
  rmSync(rendered, { force: true });
  rmSync(imgDir, { recursive: true, force: true });
  rmSync(profile, { recursive: true, force: true });
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}
