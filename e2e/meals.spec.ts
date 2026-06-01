import { test, expect } from '@playwright/test';

test.describe('meals list', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
  });

  test('displays day cards with nutrition totals', async ({ page }) => {
    await expect(page.locator('.card')).toHaveCount(3);
    const firstCard = page.locator('.card').first();
    await expect(firstCard).toContainText('kCal');
    await expect(firstCard).toContainText('CH');
    await expect(firstCard).toContainText('zsír');
  });

  test('navigates to day detail on card click', async ({ page }) => {
    await page.locator('.card').first().locator('.card-title').click();
    await expect(page).toHaveURL(/#\/meals\/.+/);
  });

  test('deletes a day from the list', async ({ page }) => {
    await expect(page.locator('.card')).toHaveCount(3);
    await page.locator('.card').first().locator('button.text-error').click();
    await expect(page.locator('.card')).toHaveCount(2);
  });
});

test.describe('create day', () => {
  test('creates a new day and navigates to it', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('days', JSON.stringify([]));
    });
    await page.goto('/');
    await page.locator('main .btn-primary').first().click();

    await expect(page).toHaveURL(/#\/meals\/.+/);
    await expect(page.getByText('Még nincsenek étkezések')).toBeVisible();
  });
});

test.describe('shopping list', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
  });

  test('opens shopping list dialog with ingredients', async ({ page }) => {
    // Open shopping list for last day card (2026-05-20)
    // Buttons: shopping (1st non-error), copy (2nd non-error), delete (text-error)
    const lastCard = page.locator('.card').last();
    await lastCard.locator('button:not(.text-error)').first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Napok')).toBeVisible();

    // Day 2026-05-20: recipe Csirkemell brokkolival (Csirkemell 200g, Brokkoli 150g, Olivaolaj 10g)
    // + Rizs 100g + Csirkemell 200g + Brokkoli 200g
    // Aggregated: Brokkoli 350, Csirkemell 400, Olivaolaj 10, Rizs 100
    await expect(dialog.locator('table tbody tr')).toHaveCount(4);
    await expect(dialog.locator('table tbody tr').filter({ hasText: 'Brokkoli' })).toContainText('350');
    await expect(dialog.locator('table tbody tr').filter({ hasText: 'Csirkemell' })).toContainText('400');
    await expect(dialog.locator('table tbody tr').filter({ hasText: 'Olivaolaj' })).toContainText('10');
    await expect(dialog.locator('table tbody tr').filter({ hasText: 'Rizs' })).toContainText('100');
  });

  test('multiplier buttons change shopping list amounts', async ({ page }) => {
    const lastCard = page.locator('.card').last();
    await lastCard.locator('button:not(.text-error)').first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Change multiplier to 3
    await dialog.getByRole('button', { name: '3' }).click();

    // Amounts should be tripled: Brokkoli 1050, Csirkemell 1200, Olivaolaj 30, Rizs 300
    await expect(dialog.locator('table tbody tr').filter({ hasText: 'Brokkoli' })).toContainText('1050');
    await expect(dialog.locator('table tbody tr').filter({ hasText: 'Csirkemell' })).toContainText('1200');
    await expect(dialog.locator('table tbody tr').filter({ hasText: 'Olivaolaj' })).toContainText('30');
    await expect(dialog.locator('table tbody tr').filter({ hasText: 'Rizs' })).toContainText('300');
  });
});

test.describe('copy day', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
  });

  test('copies a day to a new date', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    // Click copy button (2nd non-error button)
    await firstCard.locator('button:not(.text-error)').nth(1).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Nap másolása')).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Másolás' })).toBeDisabled();

    // Select day 15 in the calendar (current month, should be available)
    await dialog.locator('.react-day-picker button').filter({ hasText: /^15$/ }).click();

    await expect(dialog.getByRole('button', { name: 'Másolás' })).toBeEnabled();
    await dialog.getByRole('button', { name: 'Másolás' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL(/#\/meals\/.+/);
  });

  test('cancels copy day dialog', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('button:not(.text-error)').nth(1).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: 'Mégse' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.locator('.card')).toHaveCount(3);
  });
});

test.describe('day detail', () => {
  test('shows nutrition totals in header', async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/#/meals/2026-05-20');

    // Day 2026-05-20: lunch (469.4+130=599.4 cal) + dinner (330+68=398 cal) = 997.4 total
    await expect(page.locator('.card')).toHaveCount(2);
    await expect(page.locator('.card').first()).toContainText('Ebéd');
    await expect(page.locator('.card').last()).toContainText('Vacsora');

    const headerNutrition = page.locator('.whitespace-nowrap').first();
    await expect(headerNutrition).toContainText('997.4 kCal');
    await expect(headerNutrition).toContainText('52.5g CH');
    await expect(headerNutrition).toContainText('26.1g zsír');
  });

  test('navigates back to meals list', async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/#/meals/2026-05-20');

    await page.locator('.btn-square').click();
    await expect(page.locator('.card')).toHaveCount(3);
  });
});

test.describe('day meals and dishes', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('days', JSON.stringify([]));
    });
    await page.goto('/');
    await page.locator('main .btn-primary').first().click();
    await expect(page).toHaveURL(/#\/meals\/.+/);
  });

  test('adds and removes a meal', async ({ page }) => {
    await page.locator('main .btn-primary').first().click();
    await page.getByText('Reggeli', { exact: true }).click();

    const mealCard = page.locator('.card').filter({ hasText: 'Reggeli' });
    await expect(mealCard).toBeVisible();

    await mealCard.locator('button.text-error').click();
    await expect(mealCard).not.toBeVisible();
  });

  test('adds a dish to a meal and sets amount', async ({ page }) => {
    await page.locator('main .btn-primary').first().click();
    await page.getByText('Reggeli', { exact: true }).click();

    const mealCard = page.locator('.card').filter({ hasText: 'Reggeli' });
    await mealCard.getByPlaceholder('Étel hozzáadása...').fill('Csirke');
    await mealCard.locator('ul button').first().click();

    const dishName = await mealCard.locator('table td').first().textContent();
    expect(dishName).toContain('Csirke');

    const amountInput = mealCard.locator('input[type="number"]');
    await amountInput.fill('150');
    await amountInput.blur();

    await expect(amountInput).toHaveValue('150');
  });

  test('removes a dish from a meal', async ({ page }) => {
    await page.locator('main .btn-primary').first().click();
    await page.getByText('Reggeli', { exact: true }).click();

    const mealCard = page.locator('.card').filter({ hasText: 'Reggeli' });
    await mealCard.getByPlaceholder('Étel hozzáadása...').fill('Csirke');
    await mealCard.locator('ul button').first().click();

    const dishName = await mealCard.locator('table td').first().textContent();
    await mealCard.locator('input[type="number"]').fill('100');
    await mealCard.locator('input[type="number"]').blur();

    await mealCard.locator('table button.text-error').click();
    await expect(mealCard.getByText(dishName!)).not.toBeVisible();
  });

  test('creates a recipe variant from a dish', async ({ page }) => {
    await page.locator('main .btn-primary').first().click();
    await page.getByText('Reggeli', { exact: true }).click();

    const mealCard = page.locator('.card').filter({ hasText: 'Reggeli' });
    await mealCard.getByPlaceholder('Étel hozzáadása...').fill('Csirkemell brokkolival');
    await mealCard.locator('ul button').filter({ hasText: 'Csirkemell brokkolival' }).first().click();

    await mealCard.locator('input[type="number"]').fill('100');
    await mealCard.locator('input[type="number"]').blur();

    const variantButton = mealCard.getByRole('button', { name: 'Testreszabás' });
    await expect(variantButton).toBeVisible();
    await variantButton.click();

    await expect(async () => {
      const hasVariant = await page.evaluate(() => {
        const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        return recipes.some((recipe: { baseRecipeId?: string }) => recipe.baseRecipeId);
      });
      expect(hasVariant).toBe(true);
    }).toPass();
  });
});
