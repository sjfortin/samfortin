import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test('displays about heading and work history', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recent Timeline' })).toBeVisible();
    
    // Check that work history items are displayed
    await expect(page.getByText('Estee Lauder')).toBeVisible();
    await expect(page.getByText('Irish Titan')).toBeVisible();
  });
});
