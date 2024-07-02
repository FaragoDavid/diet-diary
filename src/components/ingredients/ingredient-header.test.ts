import { expect } from '@jest/globals';
import { Ingredient } from '@prisma/client';

import { INGREDIENT_PAGE_ID } from '../../pages/ingredient';
import '../../toContainHtml';
import { ingredientHeader, newIngredientHeader } from './ingredient-header';

describe('Ingredient Header Copmonent', () => {
  it('renders newIngredientHeader', () => {
    expect(newIngredientHeader()).toContainHtml(`
      <div class="pb-6">
        <input 
          id="ingredient-header"
          type="text" 
          name="ingredientName" 
          class="input input-bordered"
          placeholder="Alapanyag neve"
          hx-post="/new-ingredient"
          hx-target="#${INGREDIENT_PAGE_ID}"
        />
      </div>
    `);
  });

  it('renders ingredientHeader', () => {
    const ingredient: Ingredient = {
      id: 'test-ingredient-id',
      name: 'test ingredient name',
      caloriesPer100: null,
      carbsPer100: null,
      fatPer100: null,
      isVegetable: false,
      isCarbCounted: false,
    };

    expect(ingredientHeader(ingredient)).toContainHtml(`
      <div 
        id="ingredient-header"
        class="text-2xl text-center text-primary pb-6"
      >${ingredient.name}</div>
    `);
  });
});
