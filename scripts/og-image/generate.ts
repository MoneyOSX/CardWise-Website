import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generate() {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 630 });

    const templatePath = path.resolve(__dirname, 'template.html');
    await page.goto(`file://${templatePath}`, { waitUntil: 'networkidle0' });

    const outputPath = path.resolve(__dirname, '../../public/og-image.png');
    await page.screenshot({ path: outputPath, type: 'png' });

    console.log(`OG image generated: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

generate().catch((err) => {
  console.error('Failed to generate OG image:', err);
  process.exit(1);
});
