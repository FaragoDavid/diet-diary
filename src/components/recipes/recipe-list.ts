import { Ingredient } from '@prisma/client';

import { RecipeWithIngredients } from '../../repository/recipe.js';
import { RecipeListItem } from './recipe-list-item.js';

export const RECIPE_LIST_ID = 'recipe-list';

export class RecipeList implements BaseComponent {
  swapOob: HtmxSwapOobOption;
  constructor(private recipes: RecipeWithIngredients[], private ingredients: Ingredient[], options: { swapOob: HtmxSwapOobOption }) {
    this.swapOob = options.swapOob;
  }

  async render() {
    const recipeComponents: string[] = [];
    for (const recipe of this.recipes) {
      recipeComponents.push(await new RecipeListItem(recipe, this.ingredients).render());
    }

    return `
      <div 
        id="${RECIPE_LIST_ID}" 
        class="grid grid-cols-max-4 grid-row-flex gap-2"
        ${this.swapOob ? 'hx-swap-oob="true"' : ''}
      >
        ${recipeComponents.join('')}
      </div>
    `;
  }
}
