import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test('displays projects heading', async ({ page }) => {
    await page.goto('/projects');

    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page.getByText('A selection of professional projects')).toBeVisible();
  });

  test('has technology filter functionality', async ({ page }) => {
    await page.goto('/projects');

    // Open the filter collapsible
    const filterTrigger = page.getByText('Filter by Technology');
    await expect(filterTrigger).toBeVisible();
    await filterTrigger.click();

    // Check that technology filter buttons appear
    const filterButtons = page.locator('button').filter({ hasText: /React|TypeScript|JavaScript/i });
    await expect(filterButtons.first()).toBeVisible();
  });
});
