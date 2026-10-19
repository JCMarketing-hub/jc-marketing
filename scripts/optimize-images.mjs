/**
 * Converte imagens para WebP em larguras responsivas.
 * Uso: node scripts/optimize-images.mjs <pasta-de-origem> [pasta-de-destino] [larguras]
 * Ex.: node scripts/optimize-images.mjs ./originais src/assets/img 800,1600
 * Gera <nome>-<largura>.webp para cada imagem .jpg/.jpeg/.png da origem.
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, parse, resolve } from 'node:path';

const [source, target = 'src/assets/img', widthsArg = '800,1600'] = process.argv.slice(2);
if (!source) {
  console.error('Informe a pasta de origem.');
  process.exit(1);
}

const widths = widthsArg.split(',').map(Number);
const outDir = resolve(target);
mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(source).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const input = join(source, file);
  const { name } = parse(file);
  const meta = await sharp(input).metadata();
  for (const width of widths) {
    const output = join(outDir, `${name}-${width}.webp`);
    await sharp(input)
      .resize({ width: Math.min(width, meta.width), withoutEnlargement: true })
      .webp({ quality: 72, effort: 6 })
      .toFile(output);
    console.log(`${output} — ${(statSync(output).size / 1024).toFixed(0)} KB`);
  }
}
