import { expect } from '@jest/globals';
import { Ingredient } from '@prisma/client';

import '../../toContainHtml';
import { IngredientDetails } from './ingredient-details';
import { amount } from '../amount';

jest.mock('../amount');

describe('Ingredient Details Copmonent', () => {
  let ingredient: Ingredient;

  beforeEach(() => {
    (amount as jest.Mock).mockReturnValue('<mock-amount-input />');
    ingredient = {
      id: 'test-ingredient-id',
      name: 'test ingredient name',
      caloriesPer100: null,
      carbsPer100: null,
      fatPer100: null,
      isVegetable: false,
      isCarbCounted: false,
    };
  });

  it('renders with default values', async () => {
    const renderedCompmonent = await new IngredientDetails(ingredient).render();

    expect(renderedCompmonent).toContainHtml(`
      <div 
        id="ingredient-details" 
        class="grid grid-cols-max-2 grid-row-flex gap-2 pb-4 items-center"
      >
        <div class="text">Kalória:</div>
        <mock-amount-input />
        <div class="text">Szénhidrát:</div>
        <mock-amount-input />
        <div class="text-sm pl-4">számolandó:</div>
        <input 
          type="checkbox" 
          name="isCarbCounted" 
          class="checkbox checkbox-xs" 
          hx-post="/ingredient/test-ingredient-id"
        />
        <div class="text">Zsír:</div>
        <mock-amount-input />
        <div class="text">Zöldség:</div>
        <input 
          type="checkbox" 
          name="isVegetable" 
          class="checkbox checkbox-sm" 
          hx-post="/ingredient/test-ingredient-id"
        />
      </div>
    `);
  });

  it('renders with calories amount', async () => {
    ingredient.caloriesPer100 = 100;

    await new IngredientDetails(ingredient).render();

    expect(amount).toHaveBeenCalledWith({
      name: 'calories',
      amount: ingredient.caloriesPer100,
      hx: { verb: 'post', url: `/ingredient/${ingredient.id}` },
    });
  });

  it('renders with carbs amount', async () => {
    ingredient.carbsPer100 = 100;

    await new IngredientDetails(ingredient).render();

    expect(amount).toHaveBeenCalledWith({
      name: 'carbs',
      amount: ingredient.carbsPer100,
      hx: { verb: 'post', url: `/ingredient/${ingredient.id}` },
    });
  });

  it('renders with fat amount', async () => {
    ingredient.fatPer100 = 100;

    await new IngredientDetails(ingredient).render();

    expect(amount).toHaveBeenCalledWith({
      name: 'fat',
      amount: ingredient.fatPer100,
      hx: { verb: 'post', url: `/ingredient/${ingredient.id}` },
    });
  });

  it('renders with vegetable checkbox', async () => {
    ingredient.isVegetable = true;

    expect(await new IngredientDetails(ingredient).render()).toContainHtml(`
      <input 
        type="checkbox" 
        name="isVegetable" 
        class="checkbox checkbox-sm" 
        checked
        hx-post="/ingredient/test-ingredient-id"
      />
    `);
  });

  it('renders with carb counted checkbox', async () => {
    ingredient.isCarbCounted = true;

    expect(await new IngredientDetails(ingredient).render()).toContainHtml(`
      <input 
        type="checkbox" 
        name="isCarbCounted" 
        class="checkbox checkbox-xs" 
        checked
        hx-post="/ingredient/test-ingredient-id"
      />
    `);
  });
});
