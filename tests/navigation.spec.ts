import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('can navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Target nav links specifically (first match is the main nav)
    const nav = page.getByRole('navigation').first();

    // Navigate to About
    await nav.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('/about');

    // Navigate to Blog
    await nav.getByRole('link', { name: 'Blog' }).click();
    await expect(page).toHaveURL('/blog');

    // Navigate to Projects
    await nav.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL('/projects');
  });
});
