import { expect } from '@jest/globals';
import { Ingredient } from '@prisma/client';

import '../../toContainHtml';
import { HTMX_SWAP } from '../../utils/htmx';
import { IngredientList } from './ingredient-list';
import { IngredientTab } from './ingredient-tab';

jest.mock('./ingredient-list');
jest.mock('../../utils/icons', () => ({ add: '<add-icon />', search: '<search-icon />' }));

describe('Ingredient Tab Component', () => {
  it('should render', async () => {
    const ingredients: Ingredient[] = [
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

    (IngredientList.prototype.render as jest.Mock).mockReturnValue('<ingredient-list />');
    expect(await new IngredientTab(ingredients).render()).toContainHtml(`
      <div id="tab-container" 
        class="flex flex-col justify-center items-center space-y-4"
      >
        <div class="flex justify-center items-center space-x-2">
          <label class="input input-sm input-bordered flex items-center gap-2">
              <search-icon />
              <input id=ingredient-search 
                type="text" 
                placeholder="Keresés" 
                hx-get="/ingredients" 
                hx-target="#ingredient-list" 
                hx-swap="${HTMX_SWAP.ReplaceElement}" 
                hx-trigger="input" 
                hx-vals="js:{query: document.getElementById('ingredient-search').value}" 
              />
          </label>
          <div class="divider divider-horizontal"></div>
          <a href="/new-ingredient">
            <button type="submit" class="btn btn-primary btn-sm"><add-icon /></button>
          </a>
        </div>
        <ingredient-list />
      </div>
    `);
    expect(IngredientList).toHaveBeenCalledWith(ingredients, { swapOob: false });
  });
});
