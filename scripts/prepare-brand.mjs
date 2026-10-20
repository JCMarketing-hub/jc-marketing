/**
 * Prepara os recursos da marca NARKIA DIGITAL a partir dos PNGs oficiais
 * (recortes da prancha de identidade, com fundo escuro embutido).
 *
 * Não redesenha nada: apenas remove o fundo escuro da prancha (transformando-o
 * em transparência), recorta as margens e gera os tamanhos usados no site.
 *
 * Uso: node scripts/prepare-brand.mjs [pasta-dos-originais]
 * Padrão: materiais/identidade-narkia
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const source = resolve(process.argv[2] || 'materiais/identidade-narkia');
const brandDir = resolve('src/assets/brand');
const publicDir = resolve('public');
mkdirSync(brandDir, { recursive: true });

const GRAPHITE = { r: 23, g: 19, b: 33 };

/** Converte o fundo escuro da prancha em transparência ("color to alpha"). */
async function removeBackground(file, { cropBottom = 0 } = {}) {
  const img = sharp(join(source, file)).ensureAlpha();
  const meta = await img.metadata();
  const height = meta.height - cropBottom;
  const { data, info } = await img
    .extract({ left: 0, top: 0, width: meta.width, height })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Cor do fundo: média dos cantos.
  const corners = [
    [1, 1],
    [info.width - 2, 1],
    [1, info.height - 2],
    [info.width - 2, info.height - 2],
  ];
  const bg = [0, 1, 2].map(
    (k) => corners.reduce((sum, [x, y]) => sum + data[(y * info.width + x) * 4 + k], 0) / corners.length,
  );

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    let alpha = 0;
    for (let k = 0; k < 3; k++) alpha = Math.max(alpha, (data[i + k] - bg[k]) / (255 - bg[k]));
    // Ignora a textura sutil da prancha.
    alpha = alpha < 0.12 ? 0 : Math.min(1, (alpha - 0.12) / 0.88 + 0.12);
    for (let k = 0; k < 3; k++) {
      const value = alpha > 0 ? bg[k] + (data[i + k] - bg[k]) / alpha : 0;
      out[i + k] = Math.max(0, Math.min(255, Math.round(value)));
    }
    out[i + 3] = Math.round(alpha * 255);
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();
}

// Logo principal (sem slogan): cabeçalho e rodapé.
const logo = await removeBackground('02_logo_principal_sem_slogan.png');
await sharp(logo).png({ compressionLevel: 9 }).toFile(join(brandDir, 'narkia-logo.png'));
await sharp(logo).webp({ quality: 90, alphaQuality: 100 }).toFile(join(brandDir, 'narkia-logo.webp'));

// Logo com slogan: imagem de compartilhamento e materiais.
const logoSlogan = await removeBackground('01_logo_principal_com_slogan.png');
await sharp(logoSlogan).png({ compressionLevel: 9 }).toFile(join(brandDir, 'narkia-logo-slogan.png'));

// Símbolo "A" (sem a legenda que vem abaixo dele no recorte).
const symbol = await removeBackground('05_simbolo_A.png', { cropBottom: 32 });
await sharp(symbol).png().toFile(join(brandDir, 'narkia-simbolo.png'));

async function iconOnGraphite(size, padding, radius, file) {
  const inner = Math.round(size * (1 - padding * 2));
  const glyph = await sharp(symbol).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#fff"/></svg>`,
  );
  await sharp({ create: { width: size, height: size, channels: 4, background: { ...GRAPHITE, alpha: 1 } } })
    .composite([{ input: glyph, gravity: 'center' }, ...(radius ? [{ input: mask, blend: 'dest-in' }] : [])])
    .png({ compressionLevel: 9 })
    .toFile(join(publicDir, file));
}

await iconOnGraphite(64, 0.12, 14, 'favicon.png');
await iconOnGraphite(180, 0.16, 0, 'apple-touch-icon.png');

// Imagem de compartilhamento (WhatsApp, redes): 1200 × 630.
const ogLogo = await sharp(logoSlogan).resize({ width: 640, withoutEnlargement: true }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: { ...GRAPHITE, alpha: 1 } } })
  .composite([{ input: ogLogo, gravity: 'center' }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(join(publicDir, 'og-image.jpg'));

console.log('✓ Recursos da marca gerados em src/assets/brand e public/.');
