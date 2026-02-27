import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('skip-to-content link exists and works', async ({ page }) => {
    await page.goto('/')
    // Tab to the skip link (first focusable element)
    await page.keyboard.press('Tab')
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toHaveText(/skip to content/i)
  })

  test('each page has exactly one h1', async ({ page }) => {
    const pages = ['/', '/projects', '/posts', '/about', '/contact']
    for (const url of pages) {
      await page.goto(url)
      const h1Count = await page.locator('h1').count()
      expect(h1Count, `Expected 1 h1 on ${url}, got ${h1Count}`).toBe(1)
    }
  })

  test('images have alt text', async ({ page }) => {
    await page.goto('/')
    const images = page.locator('img')
    const count = await images.count()
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt, `Image ${i} missing alt text`).toBeTruthy()
    }
  })

  test('terminal has aria-live and aria-label', async ({ page }) => {
    await page.goto('/')
    const output = page.locator('[data-testid="terminal-output"]')
    await expect(output).toHaveAttribute('aria-live', 'polite')
    const input = page.locator('[aria-label="Terminal input"]')
    await expect(input).toBeVisible()
  })

  test('focus is visible on interactive elements', async ({ page }) => {
    await page.goto('/')
    // Tab through elements and verify focus ring exists
    await page.keyboard.press('Tab') // skip link
    await page.keyboard.press('Tab') // first nav element
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })
})

test.describe('Responsive', () => {
  test('homepage renders at 375px mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.locator('h1').first()).toBeVisible()
    // No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })

  test('homepage renders at 768px tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('homepage renders at 1440px desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await expect(page.locator('h1').first()).toBeVisible()
    // Terminal should be visible on desktop
    const terminal = page.locator('[data-testid="terminal"]')
    await expect(terminal).toBeVisible()
  })

  test('mobile nav works at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const desktopNav = page.locator('nav[aria-label="Main navigation"]')
    await expect(desktopNav).toBeHidden()
    await page.click('button[aria-label="Open menu"]')
    const mobileNav = page.locator('nav[aria-label="Mobile navigation"]')
    await expect(mobileNav).toBeVisible()
  })
})
