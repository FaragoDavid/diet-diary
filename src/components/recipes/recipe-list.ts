import { Ingredient } from '@prisma/client';

import { RecipeWithIngredients } from '../../repository/recipe.js';
import { RecipeListItem } from './recipe-list-item.js';

export const RECIPE_LIST_ID = 'recipe-list';

export class RecipeList implements BaseComponent {
  swap: boolean;
  constructor(private recipes: RecipeWithIngredients[], private ingredients: Ingredient[], options: { swap: boolean }) {
    this.swap = options.swap;
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
        ${this.swap ? 'hx-swap-oob="true"' : ''}
      >
        ${recipeComponents.join('')}
      </div>
    `;
  }
}
