import { test, expect } from '@playwright/test'

test.describe('Terminal', () => {
  test('terminal is visible on homepage in hero mode', async ({ page }) => {
    await page.goto('/')
    const terminal = page.locator('[data-testid="terminal"]')
    await expect(terminal).toBeVisible()
  })

  test('terminal accepts input and shows help output', async ({ page }) => {
    await page.goto('/')
    const input = page.locator('[aria-label="Terminal input"]')
    await input.fill('help')
    await input.press('Enter')

    const output = page.locator('[data-testid="terminal-output"]')
    await expect(output).toContainText('Available commands')
  })

  test('fetch command shows available routes', async ({ page }) => {
    await page.goto('/')
    const input = page.locator('[aria-label="Terminal input"]')
    await input.fill('fetch')
    await input.press('Enter')

    const output = page.locator('[data-testid="terminal-output"]')
    await expect(output).toContainText('fetch')
  })

  test('whoami command shows visitor info', async ({ page }) => {
    await page.goto('/')
    const input = page.locator('[aria-label="Terminal input"]')
    await input.fill('whoami')
    await input.press('Enter')

    const output = page.locator('[data-testid="terminal-output"]')
    await expect(output).toContainText('visitor')
  })

  test('FAB appears on non-homepage pages', async ({ page }) => {
    await page.goto('/about')
    const fab = page.locator('button[aria-label="Open terminal"]')
    await expect(fab).toBeVisible()
  })

  test('FAB opens overlay when clicked', async ({ page }) => {
    await page.goto('/about')
    const fab = page.locator('button[aria-label="Open terminal"]')
    await fab.click()

    // Overlay terminal should appear
    const terminal = page.locator('[data-testid="terminal"]')
    await expect(terminal).toBeVisible()

    // Close button should appear
    const closeBtn = page.locator('button[aria-label="Close terminal"]')
    await expect(closeBtn).toBeVisible()
  })

  test('terminal history preserved across page navigation', async ({ page }) => {
    await page.goto('/')

    // Type a command on homepage
    const input = page.locator('[aria-label="Terminal input"]')
    await input.fill('whoami')
    await input.press('Enter')

    // Navigate away
    await page.click('nav[aria-label="Main navigation"] >> text=About')
    await expect(page).toHaveURL(/\/about/)

    // Open terminal via FAB
    await page.locator('button[aria-label="Open terminal"]').click()

    // History should be preserved
    const output = page.locator('[data-testid="terminal-output"]')
    await expect(output).toContainText('visitor')
  })
})
