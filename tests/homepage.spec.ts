import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('displays hero section with name and title', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Sam Fortin' })).toBeVisible();
    await expect(page.getByText('Software Engineer')).toBeVisible();
  });

  test('has playlists CTA link', async ({ page }) => {
    await page.goto('/');

    // Target the CTA component specifically (contains "Turn your mood")
    const playlistsCTA = page.getByRole('link', { name: /Turn your mood into a Spotify playlist/i });
    await expect(playlistsCTA).toBeVisible();
    await expect(playlistsCTA).toHaveAttribute('href', '/playlists');
  });
});
