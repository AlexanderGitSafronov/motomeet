import { test } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Captures a full render of every screen into tests/e2e/__shots__ so the
 * rendered app can be compared against the original mockups. Runs once
 * (mobile project) and sets its own viewport per capture.
 */
test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'capture once')
})

const OUT = 'tests/e2e/__shots__'
const MOBILE = { width: 390, height: 844 }
// App scrolls an inner container, so a tall viewport lets long screens render
// fully (with the bottom nav at the true bottom) instead of clipping.
const MOBILE_TALL = { width: 390, height: 1500 }
const TABLET = { width: 768, height: 1024 }
const DESKTOP = { width: 1440, height: 900 }

async function settle(page: Page, ms = 1400) {
  await page.addStyleTag({
    content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}',
  }).catch(() => {})
  await page.waitForTimeout(ms)
}

async function shot(page: Page, name: string, full = true) {
  await settle(page)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full })
}

test('capture all screens', async ({ page }) => {
  test.setTimeout(180_000)

  // 01 — auth (before login)
  await page.setViewportSize(MOBILE)
  await page.goto('/')
  await shot(page, '01-auth', false)

  // sign in
  await page.getByRole('button', { name: 'Увійти', exact: true }).click()
  await page.waitForURL(/\/map$/)

  // [route, name, fullPage, tallViewport]
  const mobileRoutes: [string, string, boolean, boolean][] = [
    ['/map', '02-map', false, false],
    ['/rider/r-diego', '03-user-card', false, false],
    ['/profile', '04-profile', true, true],
    ['/events', '05-events', true, true],
    ['/events/e-alpine', '06-event-page', true, true],
    ['/create-event', '07-create-event', true, true],
    ['/community', '08-community-chat', false, false],
    ['/chats', '09-messages', true, true],
    ['/search', '10-search', true, true],
    ['/routes', '11-routes', true, true],
    ['/clubs', '12-clubs', true, true],
    ['/notifications', '13-notifications', true, true],
    ['/settings', '14-settings', true, true],
  ]

  for (const [route, name, full, tall] of mobileRoutes) {
    await page.setViewportSize(tall ? MOBILE_TALL : MOBILE)
    await page.goto(route)
    await shot(page, name, full)
  }

  // Desktop dashboard (1440)
  await page.setViewportSize(DESKTOP)
  await page.goto('/map')
  await shot(page, '15-desktop-map', false)

  // Tablet events grid (768)
  await page.setViewportSize(TABLET)
  await page.goto('/events')
  await shot(page, '16-tablet-events', true)

  // Light theme — flip via settings, then capture events + profile
  await page.setViewportSize(MOBILE_TALL)
  await page.goto('/settings')
  await page.getByRole('button', { name: 'Світла тема' }).click()
  await page.waitForTimeout(200)
  await page.goto('/events')
  await shot(page, '17-light-events', true)
  await page.goto('/profile')
  await shot(page, '18-light-profile', true)
})
