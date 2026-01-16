import { Ingredient } from '@prisma/client';
import { RecipeWithIngredients } from '../../repository/recipe';
import { RecipeListItem } from './recipe-list-item';

export const RECIPE_LIST_ID = 'recipe-list';

export class RecipeList {
  swapOob: HtmxSwapOobOption;
  constructor(private recipes: RecipeWithIngredients[], private ingredients: Ingredient[], options: { swapOob: HtmxSwapOobOption }) {
    this.swapOob = options.swapOob;
  }

  async render(): Promise<string> {
    const recipeComponents: string[] = [];
    for (const recipe of this.recipes) {
      recipeComponents.push(await new RecipeListItem(recipe, this.ingredients).render());
    }

    const swapOobAttr = this.swapOob ? ' hx-swap-oob="true"' : '';

    return `
      <div 
        id="${RECIPE_LIST_ID}" 
        class="grid grid-cols-max-4 grid-row-flex gap-2"${swapOobAttr}
      >
        ${recipeComponents.join('')}
      </div>
    `;
  }
}
