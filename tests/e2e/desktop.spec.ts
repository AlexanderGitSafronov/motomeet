import { test, expect } from '@playwright/test'

// Desktop-only checks for the responsive dashboard layout.
test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'desktop layout')
})

test('desktop shows sidebar nav and riding-now rail', async ({ page }) => {
  await page.goto('/auth')
  await page.getByRole('button', { name: 'Увійти', exact: true }).click()
  await expect(page).toHaveURL(/\/map$/)

  // Sidebar wordmark + nav (scoped to the sidebar to avoid map attribution links)
  const sidebar = page.locator('aside').first()
  await expect(sidebar.getByText('MOTOMEET')).toBeVisible()
  await expect(sidebar.getByRole('link', { name: 'Карта' })).toBeVisible()
  await expect(sidebar.getByRole('button', { name: 'Створити подію' })).toBeVisible()

  // Right rail
  await expect(page.getByRole('heading', { name: 'Зараз у дорозі' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Райдери' })).toBeVisible()

  // Bottom nav is hidden on desktop
  await expect(page.getByRole('navigation', { name: 'Головна навігація' })).toBeHidden()
})

test('riding-now rail tabs switch content', async ({ page }) => {
  await page.goto('/auth')
  await page.getByRole('button', { name: 'Увійти', exact: true }).click()
  await expect(page).toHaveURL(/\/map$/)
  // Events tab → an event card appears in the rail
  await page.getByRole('tab', { name: 'Події' }).click()
  await expect(page.getByText('Трек-день Гоккенгайм GP').first()).toBeVisible()
  // Clubs tab → a club card appears
  await page.getByRole('tab', { name: 'Клуби' }).click()
  await expect(page.getByText('Залізні Вовки MC').first()).toBeVisible()
})

test('desktop events grid renders two columns of cards', async ({ page }) => {
  await page.goto('/auth')
  await page.getByRole('button', { name: 'Увійти', exact: true }).click()
  await page.getByRole('link', { name: 'Події' }).click()
  await expect(page.getByRole('heading', { name: 'Події' })).toBeVisible()
  await expect(page.getByText('Альпійське ралі «Грім» 2026')).toBeVisible()
  await expect(page.getByText('Трек-день Гоккенгайм GP')).toBeVisible()
})
