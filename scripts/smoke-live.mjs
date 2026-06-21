import { chromium, devices } from '@playwright/test'

const URL = process.env.SMOKE_URL || 'https://motomeet-xi.vercel.app'
const browser = await chromium.launch()
const page = await browser.newPage({ ...devices['Pixel 5'] })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto(URL, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Увійти', exact: true }).click()
await page.waitForURL(/\/map$/, { timeout: 15000 })
// after real login, riders load from the DB; open search to list them
await page.goto(`${URL}/search`)
await page.waitForTimeout(2500)
const ridersText = await page.locator('h2').first().innerText().catch(() => '')
await page.screenshot({ path: 'tests/e2e/__shots__/live-smoke.png', fullPage: false })
console.log('reached:', page.url())
console.log('search heading:', ridersText)
console.log('console errors:', errors.slice(0, 5))
await browser.close()
