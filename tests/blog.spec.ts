import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
  test('displays blog heading and description', async ({ page }) => {
    await page.goto('/blog');

    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
    await expect(page.getByText('Thoughts, tutorials, and insights')).toBeVisible();
  });
});
