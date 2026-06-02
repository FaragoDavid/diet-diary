import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/#/ingredients');
});

test.describe('ingredient list', () => {
  test('table nutrition matches ingredient data', async ({ page }) => {
    // Brokkoli: 34 cal, 7 carbs, 0.4 fat per 100g
    const row = page.locator('table tbody tr').filter({ hasText: 'Brokkoli' });
    const cells = row.locator('td');
    await expect(cells.nth(1)).toHaveText('34');
    await expect(cells.nth(2)).toHaveText('7');
    await expect(cells.nth(3)).toHaveText('0.4');
  });

  test('displays ingredients sorted alphabetically by name', async ({ page }) => {
    const names = await page.locator('table tbody tr td:first-child').allTextContents();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('filters ingredients by search', async ({ page }) => {
    const totalRows = await page.locator('table tbody tr').count();
    expect(totalRows).toBeGreaterThan(1);

    await page.getByPlaceholder('Alapanyag keresése...').fill('Csirke');
    await expect(page.locator('table tbody tr')).not.toHaveCount(totalRows);
    const filteredRows = page.locator('table tbody tr');
    for (const row of await filteredRows.all()) {
      await expect(row).toContainText(/csirke/i);
    }

    await page.getByPlaceholder('Alapanyag keresése...').clear();
    await expect(page.locator('table tbody tr')).toHaveCount(totalRows);
  });
});

test.describe('create ingredient', () => {
  test('creates a new ingredient with all fields', async ({ page }) => {
    const initialRows = await page.locator('table tbody tr').count();

    await page.getByTestId('create-button').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Új Alapanyag' })).toBeVisible();

    const form = dialog.locator('form');
    await dialog.getByRole('textbox').fill('Chicken Breast');
    await form.locator('tr').filter({ hasText: 'Kal / 100g' }).locator('input').fill('165');
    await form.locator('tr').filter({ hasText: 'CH / 100g' }).locator('input').fill('1.2');
    await form.locator('tr').filter({ hasText: 'Zsír / 100g' }).locator('input').fill('3.6');
    await form.locator('tr').filter({ hasText: 'Zöldség' }).locator('input').check();
    await form.locator('tr').filter({ hasText: 'CH limit' }).locator('input[type="number"]').fill('5');

    await dialog.getByRole('button', { name: 'Új' }).click();
    await expect(dialog).not.toBeVisible();

    await expect(async () => {
      const ingredients = await page.evaluate(() => JSON.parse(localStorage.getItem('ingredients') || '[]'));
      const ingredient = ingredients.find((ing: { name: string }) => ing.name === 'Chicken Breast');
      expect(ingredient).toBeTruthy();
      expect(ingredient.caloriesPer100).toBe(165);
      expect(ingredient.carbsPer100).toBe(1.2);
      expect(ingredient.fatPer100).toBe(3.6);
      expect(ingredient.isVegetable).toBe(true);
      expect(ingredient.carbLimit).toBe(5);
    }).toPass();

    await expect(page.locator('table tbody tr')).toHaveCount(initialRows + 1);
  });
});

test.describe('edit ingredient', () => {
  test('edits all fields including name, vegetable and carb limit', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: 'Brokkoli' });
    await row.getByTestId('edit-button').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const form = dialog.locator('form');
    await dialog.getByRole('textbox').fill('Updated Brokkoli');
    await form.locator('tr').filter({ hasText: 'Kal / 100g' }).locator('input').fill('50');
    await form.locator('tr').filter({ hasText: 'CH / 100g' }).locator('input').fill('8');
    await form.locator('tr').filter({ hasText: 'Zsír / 100g' }).locator('input').fill('1.5');
    await form.locator('tr').filter({ hasText: 'Zöldség' }).locator('input').uncheck();
    await form.locator('tr').filter({ hasText: 'CH limit' }).locator('input[type="number"]').fill('3');

    await dialog.getByRole('button', { name: 'Módosítás' }).click();
    await expect(dialog).not.toBeVisible();

    await expect(async () => {
      const ingredients = await page.evaluate(() => JSON.parse(localStorage.getItem('ingredients') || '[]'));
      const ingredient = ingredients.find((ing: { name: string }) => ing.name === 'Updated Brokkoli');
      expect(ingredient).toBeTruthy();
      expect(ingredient.caloriesPer100).toBe(50);
      expect(ingredient.carbsPer100).toBe(8);
      expect(ingredient.fatPer100).toBe(1.5);
      expect(ingredient.isVegetable).toBe(false);
      expect(ingredient.carbLimit).toBe(3);
    }).toPass();
  });

  test('cancels edit without saving', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: 'Brokkoli' });
    await row.getByTestId('edit-button').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByRole('textbox').fill('Should Not Save');
    await dialog.getByRole('button', { name: 'Mégse' }).click();
    await expect(dialog).not.toBeVisible();

    const ingredients = await page.evaluate(() => JSON.parse(localStorage.getItem('ingredients') || '[]'));
    expect(ingredients.some((ing: { name: string }) => ing.name === 'Should Not Save')).toBe(false);
    expect(ingredients.some((ing: { name: string }) => ing.name === 'Brokkoli')).toBe(true);
  });
});

test.describe('delete ingredient', () => {
  test('deletes an ingredient not used elsewhere', async ({ page }) => {
    await page.getByTestId('create-button').click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('textbox').fill('To Delete');
    await dialog.getByRole('button', { name: 'Új' }).click();
    await expect(dialog).not.toBeVisible();

    await expect(page.getByText('To Delete')).toBeVisible();
    const row = page.locator('table tbody tr').filter({ hasText: 'To Delete' });
    await row.getByTestId('delete-button').click();

    await expect(page.getByText('To Delete')).not.toBeVisible();
  });

  test('shows confirmation when deleting an ingredient used in recipes', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: 'Csirkemell' }).first();
    await row.getByTestId('delete-button').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Receptekben használva')).toBeVisible();
    await expect(dialog.getByText('Csirkemell brokkolival')).toBeVisible();

    await dialog.getByRole('button', { name: 'Mégse' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(row).toBeVisible();
  });

  test('confirms deletion of an ingredient used in recipes', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: /^Csirkemell/ });
    await expect(row).toHaveCount(1);
    await row.getByTestId('delete-button').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: 'Törlés' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(row).toHaveCount(0);
  });
});
