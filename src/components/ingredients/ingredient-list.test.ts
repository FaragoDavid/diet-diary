import { expect } from '@jest/globals';
import { Ingredient } from '@prisma/client';

import '../../toContainHtml';
import { HTMX_SWAP } from '../../utils/htmx';
import { IngredientList } from './ingredient-list';
import { IngredientListItem } from './ingredient-list-item';

jest.mock('./ingredient-list-item');

describe('Ingredient List Component', () => {
  let ingredients: Ingredient[];

  beforeEach(() => {
    ingredients = [
      {
        id: '1',
        name: 'test-ingredient-name',
        caloriesPer100: 100,
        carbsPer100: 10,
        fatPer100: 10,
        isVegetable: false,
        isCarbCounted: true,
      },
      {
        id: '2',
        name: 'test-ingredient-2-name',
        caloriesPer100: 200,
        carbsPer100: 20,
        fatPer100: 20,
        isVegetable: false,
        isCarbCounted: true,
      },
    ];

    (IngredientListItem.prototype.render as jest.Mock).mockReturnValue('<ingredient-list-item />');
  });

  it('should render when all macros are set on the ingredient', async () => {
    expect(await new IngredientList(ingredients, { swapOob: false }).render()).toContainHtml(`
      <div id="ingredient-list" class="grid grid-cols-max-6 grid-row-flex gap-2 items-center">
        <ingredient-list-item />
        <div class="divider m-0 col-span-6"></div>
        <ingredient-list-item />
      </div>
    `);
    ingredients.forEach((ingredient) => {
      expect(IngredientListItem).toHaveBeenCalledWith(ingredient);
    });
  });

  it('should include hx-swap-oob tag when swapOob option is not false', async () => {
    expect(await new IngredientList(ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render()).toContainHtml(`
      <div 
        id="ingredient-list" 
        class="grid grid-cols-max-6 grid-row-flex gap-2 items-center" 
        hx-swap-oob="${HTMX_SWAP.ReplaceElement}">
    `);
  });
});
