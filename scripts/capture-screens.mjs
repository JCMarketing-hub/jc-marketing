/**
 * Captura telas reais das páginas-conceito para os mockups da home.
 * Requer o site servido localmente (ex.: npm run build && npm run preview).
 * Uso: node scripts/capture-screens.mjs [url-base]
 * Variável opcional CHROME_PATH aponta para o Chrome/Edge.
 */
import sharp from 'sharp';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const baseUrl = (process.argv[2] || 'http://localhost:4173/').replace(/\/?$/, '/');
const chrome =
  process.env.CHROME_PATH ||
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].find((p) => existsSync(p));

if (!chrome) {
  console.error('Chrome/Edge não encontrado. Defina CHROME_PATH.');
  process.exit(1);
}

// name, caminho, viewport, escala, largura final em WebP
const shots = [
  ['autotech-desktop', 'projetos/autotech/', [1440, 900], 1, 1200],
  ['autotech-mobile', 'projetos/autotech/', [500, 1080], 2, 520],
  ['burger-house-desktop', 'projetos/burger-house/', [1440, 900], 1, 900],
  ['studio-belle-desktop', 'projetos/studio-belle/', [1440, 900], 1, 900],
];

const outDir = resolve('src/assets/img/telas');
mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'jc-telas-'));

for (const [name, path, [w, h], scale, finalWidth] of shots) {
  const png = join(tmp, `${name}.png`);
  const result = spawnSync(
    chrome,
    [
      '--headless=new',
      '--hide-scrollbars',
      '--disable-gpu',
      `--user-data-dir=${join(tmp, 'perfil')}`,
      `--window-size=${w},${h}`,
      `--force-device-scale-factor=${scale}`,
      '--virtual-time-budget=6000',
      `--screenshot=${png}`,
      baseUrl + path,
    ],
    { stdio: 'inherit' },
  );
  if (result.status !== 0 || !existsSync(png)) {
    console.error(`Falha ao capturar ${name}.`);
    process.exit(1);
  }
  const output = join(outDir, `${name}.webp`);
  await sharp(png).resize({ width: finalWidth }).webp({ quality: 78, effort: 6 }).toFile(output);
  console.log(`${output}`);
}

rmSync(tmp, { recursive: true, force: true });
