import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/fetching\.design/)
  })

  test('homepage renders hero heading', async ({ page }) => {
    await page.goto('/')
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
  })

  test('nav links navigate to all pages', async ({ page }) => {
    await page.goto('/')

    // Projects
    await page.click('nav[aria-label="Main navigation"] >> text=Projects')
    await expect(page).toHaveURL(/\/projects/)
    await expect(page.locator('h1', { hasText: 'Projects' })).toBeVisible()

    // Blog
    await page.click('nav[aria-label="Main navigation"] >> text=Blog')
    await expect(page).toHaveURL(/\/posts/)
    await expect(page.locator('h1', { hasText: 'Posts' })).toBeVisible()

    // About
    await page.click('nav[aria-label="Main navigation"] >> text=About')
    await expect(page).toHaveURL(/\/about/)
    await expect(page.locator('h1', { hasText: 'About' })).toBeVisible()

    // Contact
    await page.click('nav[aria-label="Main navigation"] >> text=Contact')
    await expect(page).toHaveURL(/\/contact/)
    await expect(page.locator('h1', { hasText: 'Get in Touch' })).toBeVisible()
  })

  test('logo returns to homepage', async ({ page }) => {
    await page.goto('/about')
    await page.click('a[aria-label="Home"]')
    await expect(page).toHaveURL(/\/$/)
  })

  test('mobile menu opens and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    // Main nav should be hidden on mobile
    const desktopNav = page.locator('nav[aria-label="Main navigation"]')
    await expect(desktopNav).toBeHidden()

    // Open hamburger
    await page.click('button[aria-label="Open menu"]')

    // Mobile nav should appear
    const mobileNav = page.locator('nav[aria-label="Mobile navigation"]')
    await expect(mobileNav).toBeVisible()

    // Navigate via mobile menu
    await mobileNav.locator('text=About').click()
    await expect(page).toHaveURL(/\/about/)

    // Menu should close after navigation
    await expect(mobileNav).toBeHidden()
  })

  test('header becomes sticky with border on scroll', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header').first()

    // Before scroll: transparent
    await expect(header).not.toHaveClass(/border-b/)

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 200))
    await page.waitForTimeout(100)

    // After scroll: has border and backdrop
    await expect(header).toHaveClass(/border-b/)
  })
})
