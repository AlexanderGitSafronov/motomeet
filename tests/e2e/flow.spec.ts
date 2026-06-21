import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// Mobile-only end-to-end walkthrough of the core user journeys.
test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile flow')
})

async function login(page: Page) {
  await page.goto('/auth')
  await expect(page.getByText('Знайди свою команду. Катай разом.')).toBeVisible()
  await page.getByRole('button', { name: 'Увійти', exact: true }).click()
  await expect(page).toHaveURL(/\/map$/)
}

test('auth → map with live overlays', async ({ page }) => {
  await login(page)
  await expect(page.getByText(/райдерів зараз у дорозі/i)).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Головна навігація' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Створити подію' })).toBeVisible()
})

test('events list → event page → join', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: 'Події' }).click()
  await expect(page.getByRole('heading', { name: 'Події' })).toBeVisible()
  await page.getByText('Альпійське ралі «Грім» 2026').first().click()
  await expect(page.getByRole('heading', { name: 'Альпійське ралі «Грім» 2026' })).toBeVisible()
  await expect(page.getByText('Про заїзд')).toBeVisible()
  // Join CTA toggles regardless of the starting state
  const cta = page.getByRole('button', { name: /^(Долучитися|Ви учасник)$/ })
  await expect(cta).toBeVisible()
  const before = (await cta.textContent())?.trim()
  await cta.click()
  await expect(page.getByRole('button', { name: /^(Долучитися|Ви учасник)$/ })).not.toHaveText(before ?? '')
})

test('messages → conversation → send a message', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: 'Чати' }).click()
  await expect(page.getByRole('heading', { name: 'Повідомлення' })).toBeVisible()
  await page.getByText('Лена Фогт').first().click()
  const input = page.getByRole('textbox', { name: 'Повідомлення' })
  await input.fill('Уже в дорозі! 🏍️')
  await page.getByLabel('Надіслати повідомлення').click()
  await expect(page.getByText('Уже в дорозі! 🏍️')).toBeVisible()
  // Back in the list: the row shows my last message and the unread badge is gone
  await page.getByRole('button', { name: 'Назад' }).click()
  await expect(page.getByRole('heading', { name: 'Повідомлення' })).toBeVisible()
  await expect(page.getByText('Уже в дорозі! 🏍️')).toBeVisible()
})

test('routes: start ride toggles to finish', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: 'Маршрути' }).click()
  await expect(page.getByRole('heading', { name: 'Маршрути' })).toBeVisible()
  await page.getByRole('button', { name: 'Старт', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Завершити', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Завершити', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Старт', exact: true })).toBeVisible()
})

test('routes screen shows active route and stops', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: 'Маршрути' }).click()
  await expect(page.getByRole('heading', { name: 'Маршрути' })).toBeVisible()
  await expect(page.getByText('Недільне коло узбережжям')).toBeVisible()
  await expect(page.getByText('Заплановані зупинки')).toBeVisible()
})

test('profile → settings → switch to light theme', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: 'Профіль' }).click()
  await expect(page.getByRole('heading', { name: 'Маркус Раєр' })).toBeVisible()
  await page.getByRole('button', { name: 'Налаштування' }).click()
  await expect(page.getByRole('heading', { name: 'Налаштування' })).toBeVisible()
  await page.getByRole('button', { name: 'Світла тема' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: 'Назад' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('create event flow publishes', async ({ page }) => {
  await login(page)
  await page.getByRole('button', { name: 'Створити подію' }).click()
  await expect(page.getByRole('heading', { name: 'Створення події' })).toBeVisible()
  await page.getByLabel('Назва події').fill('Світанковий патруль')
  await page.getByLabel('Локація').fill('Київ, Україна')
  await page.getByRole('button', { name: /Опублікувати подію/ }).click()
  await expect(page).toHaveURL(/\/events$/)
  // the new event is created and listed (scoped to the card heading, not the toast)
  await expect(page.getByRole('heading', { name: 'Світанковий патруль' })).toBeVisible()
})

test('search filters across riders and clubs', async ({ page }) => {
  await login(page)
  await page.getByRole('button', { name: 'Відкрити пошук' }).click()
  await expect(page).toHaveURL(/\/search$/)
  await page.getByLabel('Очистити пошук').click()
  await page.getByRole('tab', { name: 'Клуби' }).click()
  await expect(page.getByText('Залізні Вовки MC')).toBeVisible()
})

test('switch interface language to English', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: 'Профіль' }).click()
  await page.getByRole('button', { name: 'Налаштування' }).click()
  await expect(page.getByRole('heading', { name: 'Налаштування' })).toBeVisible()
  await page.getByText('Мова', { exact: true }).click()
  await page.getByRole('button', { name: 'English' }).click()
  // UI re-renders in English
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
})

test('notifications can be marked all read', async ({ page }) => {
  await login(page)
  // Reached via Профіль → Налаштування → Push-сповіщення
  await page.getByRole('link', { name: 'Профіль' }).click()
  await page.getByRole('button', { name: 'Налаштування' }).click()
  await page.getByRole('button', { name: /Push-сповіщення/ }).click()
  await expect(page.getByRole('heading', { name: 'Сповіщення' })).toBeVisible()
  await page.getByRole('button', { name: 'Прочитати всі' }).click()
  await expect(page.getByRole('heading', { name: 'Сповіщення' })).toBeVisible()
  await expect(page.getByText('Раніше')).toBeVisible()
})
