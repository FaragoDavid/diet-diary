import { expect } from '@jest/globals';
import { Ingredient } from '@prisma/client';

import '../../toContainHtml';
import { IngredientSelector } from './ingredient-selector';
import { HTMX_SWAP } from '../../utils/htmx';

describe('Ingredient Selector Component', () => {
  let ingredients: Ingredient[];
  let recipeIngredientIds: string[];

  beforeEach(() => {
    ingredients = [
      {
        id: '1',
        name: 'test-ingredient-name',
        caloriesPer100: 100,
        carbsPer100: 10,
        fatPer100: 1,
        isCarbCounted: true,
        isVegetable: false,
      },
      {
        id: '2',
        name: 'test-ingredient-2-name',
        caloriesPer100: 200,
        carbsPer100: 20,
        fatPer100: 2,
        isCarbCounted: true,
        isVegetable: false,
      },
    ];
    recipeIngredientIds = [ingredients[0].id];
  });

  it('renders', async () => {
    expect(await new IngredientSelector(recipeIngredientIds, ingredients, { swapOob: false }).render()).toContainHtml(`
      <div id="ingredient-selector" class="flex justify-center">
        <select name="ingredientId" class="select select-bordered select-sm">
            <option disabled selected>Válassz</option>
            <option value="${ingredients[1].id}">${ingredients[1].name}</option>
        </select>
      </div>
    `);
  });

  it('includes hx-swap-oob tag when swapOob option is not false', async () => {
    expect(await new IngredientSelector(recipeIngredientIds, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render()).toContainHtml(`
      <div id="ingredient-selector" 
        class="flex justify-center" 
        hx-swap-oob="${HTMX_SWAP.ReplaceElement}"
      >
    `);
  });
});
