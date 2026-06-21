import { test } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Generator (not an assertion): re-exports the four phone-frame screenshots
 * shown on the landing page, captured from the live Ukrainian app in dark mode.
 * Guarded behind CAPTURE_LANDING so it never runs in the normal suite.
 *
 *   CAPTURE_LANDING=1 npx playwright test landing-screens --project=mobile
 */
test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })

test.beforeEach(async ({}, info) => {
  test.skip(info.project.name !== 'mobile', 'capture once')
  test.skip(!process.env.CAPTURE_LANDING, 'generator — run with CAPTURE_LANDING=1')
})

async function settle(page: Page, ms = 1500) {
  await page
    .addStyleTag({
      content:
        '*{animation:none!important;transition:none!important;caret-color:transparent!important}' +
        '.reveal{opacity:1!important;transform:none!important}',
    })
    .catch(() => {})
  await page.waitForTimeout(ms)
}

test('capture landing phone screens', async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto('/auth')
  await page.getByRole('button', { name: 'Увійти', exact: true }).click()
  await page.waitForURL(/\/map$/)

  const screens: [string, string, number][] = [
    ['/map', 'screen-map', 2200], // map needs tiles to paint
    ['/events/e-alpine', 'screen-event', 1500],
    ['/profile', 'screen-profile', 1500],
    ['/community', 'screen-chat', 1500],
  ]
  for (const [route, name, wait] of screens) {
    await page.goto(route)
    await settle(page, wait)
    await page.screenshot({ path: `public/landing/${name}.png` })
  }
})
