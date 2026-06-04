import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test('shows app title and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Diéta Napló')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Étkezések' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Receptek' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Alapanyagok' })).toBeVisible();
});

test('navigates between pages', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Alapanyagok' }).click();
  await expect(page).toHaveURL(/#\/ingredients/);
  await expect(page.getByPlaceholder('Alapanyag keresése...')).toBeVisible();

  await page.getByRole('link', { name: 'Receptek' }).click();
  await expect(page).toHaveURL(/#\/recipes/);
  await expect(page.getByPlaceholder('Recept keresése...')).toBeVisible();

  await page.getByRole('link', { name: 'Étkezések' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('shows loading overlay and success toast on upload', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('upload-button').click();
  await expect(page.getByTestId('sync-overlay')).toBeVisible();

  await expect(page.getByTestId('sync-overlay')).not.toBeVisible();
  await expect(page.getByText('Feltöltés sikeres!')).toBeVisible();
});

test('shows loading overlay and success toast on refresh', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('refresh-button').click();
  await expect(page.getByTestId('sync-overlay')).toBeVisible();

  await expect(page.getByTestId('sync-overlay')).not.toBeVisible();
  await expect(page.getByText('Frissítés sikeres!')).toBeVisible();
});
