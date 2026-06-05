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

test('upload button is disabled until data changes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('upload-button')).toBeDisabled();
});

test.describe('upload enables after mutation', () => {
  test('ingredient change enables upload', async ({ page }) => {
    await page.goto('/#/ingredients');

    await page.getByTestId('create-button').click();
    await page.getByRole('dialog').getByRole('textbox').fill('Test');
    await page.getByRole('dialog').getByRole('button', { name: 'Hozzáadás' }).click();

    await expect(page.getByTestId('upload-button')).toBeEnabled();
  });

  test('recipe change enables upload', async ({ page }) => {
    await page.goto('/#/recipes');

    await page.getByTestId('create-button').click();
    await page.getByRole('dialog').locator('form').getByRole('textbox').fill('Test');
    await page.getByRole('dialog').getByRole('button', { name: 'Kész' }).click();

    await expect(page.getByTestId('upload-button')).toBeEnabled();
  });

  test('meal change enables upload', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('days', JSON.stringify([])));
    await page.goto('/');

    await page.getByTestId('create-button').click();
    await page.getByTestId('add-meal-button').click();
    await page.getByText('Reggeli', { exact: true }).click();

    await expect(page.getByTestId('upload-button')).toBeEnabled();
  });
});

test('shows loading overlay and success toast on upload', async ({ page }) => {
  await page.goto('/#/ingredients');

  await page.getByTestId('create-button').click();
  await page.getByRole('dialog').getByRole('textbox').fill('Test');
  await page.getByRole('dialog').getByRole('button', { name: 'Hozzáadás' }).click();

  await page.getByTestId('upload-button').click();
  await expect(page.getByTestId('sync-overlay')).toBeVisible();

  await expect(page.getByTestId('sync-overlay')).not.toBeVisible();
  await expect(page.getByText('Feltöltés sikeres!')).toBeVisible();
  await expect(page.getByTestId('upload-button')).toBeDisabled();
});

test('shows loading overlay and success toast on refresh', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('refresh-button').click();
  await expect(page.getByTestId('sync-overlay')).toBeVisible();

  await expect(page.getByTestId('sync-overlay')).not.toBeVisible();
  await expect(page.getByText('Frissítés sikeres!')).toBeVisible();
});
