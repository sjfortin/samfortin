import { test, expect } from '@playwright/test';

test.describe('Playlists Page', () => {
  test('displays playlists page', async ({ page }) => {
    await page.goto('/playlists');

    // Page should load without errors
    await expect(page).toHaveURL('/playlists');
  });
});
