import { expect } from '@jest/globals';
import { Ingredient } from '@prisma/client';

import '../../toContainHtml';
import { stats } from '../stats';
import { IngredientListItem } from './ingredient-list-item';

jest.mock('../stats');
jest.mock('../../utils/icons', () => ({ edit: '<edit-icon />', delete: '<delete-icon />' }));

describe('Ingredient List Item Component', () => {
  let ingredient: Ingredient;
  let statArgs: { cal: number | null; carbs: number | null; fat: number | null };

  beforeEach(() => {
    ingredient = {
      id: '1',
      name: 'test-ingredient-name',
      caloriesPer100: 100,
      carbsPer100: 10,
      fatPer100: 10,
      isVegetable: false,
      isCarbCounted: true,
    };
    statArgs = { cal: ingredient.caloriesPer100, carbs: ingredient.carbsPer100, fat: ingredient.fatPer100 };

    (stats as jest.Mock).mockImplementation(() => '<ingredient-stats />');
  });

  it('renders when all macros are set on the ingredient', async () => {
    expect(await new IngredientListItem(ingredient).render()).toContainHtml(`
      <div class="text-sm text-wrap max-w-24">test-ingredient-name</div>
      <ingredient-stats />
      <div class="flex justify-center items-center pl-2">
        <a href="/ingredient/1" class="btn btn-xs btn-secondary"><edit-icon /></a>
      </div>
      <div class="flex justify-center items-center">
        <div class="btn btn-xs" hx-delete="/ingredient/1" hx-target="this" hx-swap="outerHTML" hx-vals="js:{query: document.getElementById('ingredient-search').value}">
            <delete-icon />
        </div>
      </div>
    `);
    expect(stats).toHaveBeenCalledWith(statArgs, { layout: 'cells', size: 'sm', swapOob: false });
  });

  [
    { recordKey: 'caloriesPer100', name: 'calories', statsArgKey: 'cal' },
    { recordKey: 'carbsPer100', name: 'carbs', statsArgKey: 'carbs' },
    { recordKey: 'fatPer100', name: 'fat', statsArgKey: 'fat' },
  ].forEach(({ recordKey, name, statsArgKey }) => {
    it(`should render correct stats when ${name} is not set on the ingredient`, async () => {
      await new IngredientListItem({ ...ingredient, [recordKey]: null }).render();

      expect(stats).toHaveBeenCalledWith({ ...statArgs, [statsArgKey]: 0 }, { layout: 'cells', size: 'sm', swapOob: false });
    });
  });
});
