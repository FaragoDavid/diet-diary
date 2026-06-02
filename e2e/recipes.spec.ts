import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/#/recipes');
});

test.describe('recipe list', () => {
  test('filters recipes by search', async ({ page }) => {
    const totalRows = await page.locator('table tbody tr').count();
    expect(totalRows).toBeGreaterThan(1);

    await page.getByPlaceholder('Recept keresése...').fill('Csirke');
    await expect(page.locator('table tbody tr')).not.toHaveCount(totalRows);
    const filteredRows = page.locator('table tbody tr');
    for (const row of await filteredRows.all()) {
      await expect(row).toContainText(/csirke/i);
    }

    await page.getByPlaceholder('Recept keresése...').clear();
    await expect(page.locator('table tbody tr')).toHaveCount(totalRows);
  });

  test('table nutrition matches calculated nutrition from ingredients', async ({ page }) => {
    // Csirkemell 200g (165/100g) + Brokkoli 150g (34/100g) + Olivaolaj 10g (884/100g)
    // = 330 + 51 + 88.4 = 469.4 cal, 0 + 10.5 + 0 = 10.5 carbs, 7.2 + 0.6 + 10 = 17.8 fat
    const row = page.locator('table tbody tr').filter({ hasText: 'Csirkemell brokkolival' });
    const cells = row.locator('td');
    await expect(cells.nth(1)).toHaveText('469.4');
    await expect(cells.nth(2)).toHaveText('10.5');
    await expect(cells.nth(3)).toHaveText('17.8');
  });

  test('displays recipes sorted alphabetically by name', async ({ page }) => {
    const names = await page.locator('table tbody tr td:first-child').allTextContents();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});

test.describe('create recipe', () => {
  test('creates and persists a new recipe', async ({ page }) => {
    const initialRows = await page.locator('table tbody tr').count();

    await page.getByTestId('create-button').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.locator('form').getByRole('textbox').fill('Test Recipe');
    await dialog.locator('form tr').filter({ hasText: 'Mennyiség (g)' }).locator('input').fill('500');
    await dialog.locator('form tr').filter({ hasText: 'Adag' }).locator('input').fill('4');
    await dialog.getByTestId('close-button').click();

    await expect(async () => {
      const recipes = await page.evaluate(() => JSON.parse(localStorage.getItem('recipes') || '[]'));
      const recipe = recipes.find((rec: { name: string }) => rec.name === 'Test Recipe');
      expect(recipe).toBeTruthy();
      expect(recipe.amount).toBe(500);
      expect(recipe.servings).toBe(4);
    }).toPass();

    await expect(page.locator('table tbody tr')).toHaveCount(initialRows + 1);
  });

  test('saves recipe on Done without explicit header Save', async ({ page }) => {
    const initialRows = await page.locator('table tbody tr').count();

    await page.getByTestId('create-button').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.locator('form').getByRole('textbox').fill('Auto Saved Recipe');
    await dialog.locator('form tr').filter({ hasText: 'Mennyiség (g)' }).locator('input').fill('300');
    await dialog.locator('form tr').filter({ hasText: 'Adag' }).locator('input').fill('2');
    await dialog.getByTestId('close-button').click();

    await expect(dialog).not.toBeVisible();

    await expect(async () => {
      const recipes = await page.evaluate(() => JSON.parse(localStorage.getItem('recipes') || '[]'));
      const recipe = recipes.find((rec: { name: string }) => rec.name === 'Auto Saved Recipe');
      expect(recipe).toBeTruthy();
      expect(recipe.amount).toBe(300);
      expect(recipe.servings).toBe(2);
    }).toPass();

    await expect(page.locator('table tbody tr')).toHaveCount(initialRows + 1);
  });

  test('cancels recipe creation and removes empty recipe', async ({ page }) => {
    await page.getByTestId('create-button').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByTestId('close-button').click();
    await expect(dialog).not.toBeVisible();

    const recipes = await page.evaluate(() => JSON.parse(localStorage.getItem('recipes') || '[]'));
    expect(recipes.every((rec: { name: string }) => rec.name.trim() !== '')).toBe(true);
  });

  test('adds ingredient to newly created recipe', async ({ page }) => {
    await page.getByTestId('create-button').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.locator('form').getByRole('textbox').fill('Test Recipe');
    await dialog.getByTestId('close-button').click();

    await page.locator('table tbody tr').filter({ hasText: 'Test Recipe' }).getByTestId('edit-button').click();
    await expect(dialog).toBeVisible();

    const searchInput = dialog.getByPlaceholder('Alapanyag hozzáadása...');
    await searchInput.click();
    await searchInput.pressSequentially('Rizs');

    const dropdownButton = dialog.locator('ul button').filter({ hasText: /^Rizs/ }).first();
    await expect(dropdownButton).toBeVisible();
    await dropdownButton.click();

    const rizsRow = dialog.locator('table tbody tr').filter({ hasText: 'Rizs' });
    await expect(rizsRow).toBeVisible();
  });
});

test.describe('edit recipe header', () => {
  test('edits name, amount and servings', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: 'Csirkemell brokkolival' });
    await row.getByTestId('edit-button').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('h3')).toHaveText('Csirkemell brokkolival');

    await dialog.getByTestId('edit-header-button').click();

    const form = dialog.locator('form');
    await form.getByRole('textbox').fill('Updated Recipe');
    await form.locator('tr').filter({ hasText: 'Mennyiség (g)' }).locator('input').fill('500');
    await form.locator('tr').filter({ hasText: 'Adag' }).locator('input').fill('3');
    await dialog.getByRole('button', { name: 'Mentés' }).click();

    await expect(dialog.locator('h3')).toHaveText('Updated Recipe');

    await expect(async () => {
      const recipes = await page.evaluate(() => JSON.parse(localStorage.getItem('recipes') || '[]'));
      const recipe = recipes.find((rec: { name: string }) => rec.name === 'Updated Recipe');
      expect(recipe).toBeTruthy();
      expect(recipe.amount).toBe(500);
      expect(recipe.servings).toBe(3);
    }).toPass();
  });

  test('cancels header edit without saving', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: 'Csirkemell brokkolival' });
    await row.getByTestId('edit-button').click();

    const dialog = page.getByRole('dialog');
    await dialog.getByTestId('edit-header-button').click();

    const form = dialog.locator('form');
    await form.getByRole('textbox').fill('Should Not Save');
    await form.getByRole('button', { name: 'Mégse' }).click();

    await expect(dialog.locator('h3')).toHaveText('Csirkemell brokkolival');

    const recipes = await page.evaluate(() => JSON.parse(localStorage.getItem('recipes') || '[]'));
    expect(recipes.some((rec: { name: string }) => rec.name === 'Should Not Save')).toBe(false);
    expect(recipes.some((rec: { name: string }) => rec.name === 'Csirkemell brokkolival')).toBe(true);
  });
});

test.describe('edit recipe ingredients', () => {
  test('adds an ingredient via search', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: 'Csirkemell brokkolival' });
    await row.getByTestId('edit-button').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const searchInput = dialog.getByPlaceholder('Alapanyag hozzáadása...');
    await searchInput.click();
    await searchInput.pressSequentially('Rizs');

    const dropdownButton = dialog.locator('ul button').filter({ hasText: /^Rizs/ }).first();
    await expect(dropdownButton).toBeVisible();
    await dropdownButton.click();

    const rizsRow = dialog.locator('table tbody tr').filter({ hasText: 'Rizs' });
    await expect(rizsRow).toBeVisible();
    await expect(rizsRow.locator('input[type="number"]')).toHaveValue('');
  });

  test('sets ingredient amount and recalculates nutrition', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: 'Csirkemell brokkolival' });
    await row.getByTestId('edit-button').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const brokkoliRow = dialog.locator('table tbody tr').filter({ hasText: 'Brokkoli' });
    const amountInput = brokkoliRow.locator('input[type="number"]');
    await expect(amountInput).toHaveValue('150');
    await amountInput.fill('300');
    await amountInput.blur();

    // Csirkemell 200g + Brokkoli 300g + Olivaolaj 10g = 520.4 cal, 21 carbs, 18.4 fat
    await expect(async () => {
      const recipes = await page.evaluate(() => JSON.parse(localStorage.getItem('recipes') || '[]'));
      const recipe = recipes.find((rec: { name: string }) => rec.name === 'Csirkemell brokkolival');
      const brokkoli = recipe.ingredients.find((ing: { name: string }) => ing.name === 'Brokkoli');
      expect(brokkoli.amount).toBe(300);
      expect(recipe.calories).toBe(520.4);
      expect(recipe.carbs).toBe(21);
      expect(recipe.fat).toBe(18.4);
    }).toPass();
  });

  test('removes ingredient and recalculates nutrition', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: 'Csirkemell brokkolival' });
    await row.getByTestId('edit-button').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const brokkoliRow = dialog.locator('table tbody tr').filter({ hasText: 'Brokkoli' });
    await brokkoliRow.getByTestId('delete-button').click();
    await expect(brokkoliRow).not.toBeVisible();

    // Csirkemell 200g + Olivaolaj 10g = 418.4 cal, 0 carbs, 17.2 fat
    await expect(async () => {
      const recipes = await page.evaluate(() => JSON.parse(localStorage.getItem('recipes') || '[]'));
      const recipe = recipes.find((rec: { name: string }) => rec.name === 'Csirkemell brokkolival');
      expect(recipe.ingredients).toHaveLength(2);
      expect(recipe.ingredients.some((ing: { name: string }) => ing.name === 'Brokkoli')).toBe(false);
      expect(recipe.calories).toBe(418.4);
      expect(recipe.carbs).toBe(0);
      expect(recipe.fat).toBe(17.2);
    }).toPass();
  });
});

test.describe('delete recipe', () => {
  test('deletes a recipe not used in days', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: 'Csirkés rizstál' });
    await expect(row).toHaveCount(1);
    await row.getByTestId('delete-button').click();

    await expect(row).toHaveCount(0);
  });

  test('shows confirmation when deleting a recipe used in days', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: 'Csirkemell brokkolival' });
    await row.getByTestId('delete-button').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Recept törlése')).toBeVisible();
    await expect(dialog.getByText('Napokban használva')).toBeVisible();

    await dialog.getByRole('button', { name: 'Mégse' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(row).toBeVisible();
  });

  test('confirms deletion of a recipe used in days', async ({ page }) => {
    const row = page.locator('table tbody tr').filter({ hasText: 'Csirkemell brokkolival' });
    await expect(row).toHaveCount(1);
    await row.getByTestId('delete-button').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: 'Törlés' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(row).toHaveCount(0);
  });
});
