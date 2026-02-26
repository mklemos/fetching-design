import { test, expect } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin Panel', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async ({ page }) => {
    await login({ page, user: testUser })
    await page.goto('/admin')
    const dashboardArtifact = page.locator('span[title="Dashboard"]').first()
    await expect(dashboardArtifact).toBeVisible()
  })

  test('can navigate to users list', async ({ page }) => {
    await login({ page, user: testUser })
    await page.goto('/admin/collections/users')
    const heading = page.locator('h1', { hasText: 'Users' }).first()
    await expect(heading).toBeVisible()
  })

  test('can navigate to page create view', async ({ page }) => {
    await login({ page, user: testUser })
    await page.goto('/admin/collections/pages/create')
    await expect(page).toHaveURL(/\/admin\/collections\/pages\//)
    const titleInput = page.locator('input[name="title"]')
    await expect(titleInput).toBeVisible()
  })
})
