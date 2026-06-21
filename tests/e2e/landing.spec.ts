import { test, expect } from '@playwright/test'

test('landing renders hero, sections and links to auth', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /RIDE THE WORLD/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'ONE APP FOR THE WHOLE RIDE' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'YOUR NEXT RIDE STARTS HERE' })).toBeVisible()

  // primary CTA routes to the auth screen
  await page.getByRole('link', { name: 'Get the app' }).first().click()
  await expect(page).toHaveURL(/\/auth$/)
})

test('landing download buttons go to auth', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /App Store/i }).first().click()
  await expect(page).toHaveURL(/\/auth$/)
})
