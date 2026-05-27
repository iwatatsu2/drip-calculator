import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'gen-thumbnail.html');
const outPath = path.join(__dirname, '..', 'thumbnail-drip-calculator.png');

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outPath, type: 'png' });
await browser.close();
console.log(`Saved: ${outPath}`);
