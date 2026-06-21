// Renders the MotoMeet helmet logo (Material Symbols `sports_motorsports` on the
// brand gradient) to PNG icons, so the favicon / PWA icons match the in-app logo.
import { chromium } from '@playwright/test'

const html = (size, radius) => `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0&display=swap" rel="stylesheet">
<style>
  html,body{margin:0;padding:0;background:transparent}
  .tile{width:${size}px;height:${size}px;display:grid;place-items:center;border-radius:${radius}px;
    background:linear-gradient(135deg,#A78BFA 0%,#7C3AED 100%);}
  .ico{font-family:'Material Symbols Rounded';color:#fff;font-size:${Math.round(size * 0.58)}px;
    font-variation-settings:'FILL' 0,'wght' 500,'GRAD' 0,'opsz' 48;line-height:1;}
</style></head><body>
<div class="tile"><span class="ico">sports_motorsports</span></div>
</body></html>`

const targets = [
  [512, 0, 'pwa-512x512.png'], // full-bleed (maskable-friendly)
  [192, 0, 'pwa-192x192.png'],
  [180, 40, 'apple-touch-icon.png'],
  [64, 14, 'favicon-64.png'],
]

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })
for (const [size, radius, name] of targets) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(html(size, radius), { waitUntil: 'load' })
  await page.evaluate(async () => {
    await document.fonts.load(`48px 'Material Symbols Rounded'`)
    await document.fonts.ready
  })
  await page.waitForTimeout(400)
  const el = await page.$('.tile')
  await el.screenshot({ path: `public/${name}`, omitBackground: true })
  console.log('wrote', name)
}
await browser.close()
console.log('done')
