import { test, expect } from '@playwright/test'

test('landing renders hero, sections and links to auth', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /КАТАЙ ПО СВІТУ/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'ОДИН ЗАСТОСУНОК ДЛЯ ВСЬОГО ЗАЇЗДУ' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'ТВІЙ НАСТУПНИЙ ЗАЇЗД ПОЧИНАЄТЬСЯ ТУТ' })).toBeVisible()

  // primary CTA routes to the auth screen
  await page.getByRole('link', { name: 'Завантажити застосунок' }).first().click()
  await expect(page).toHaveURL(/\/auth$/)
})

test('landing download buttons go to auth', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /App Store/i }).first().click()
  await expect(page).toHaveURL(/\/auth$/)
})
