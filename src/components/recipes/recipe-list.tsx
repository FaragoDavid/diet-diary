import { RecipeWithIngredients } from '../../repository/recipe';
import { recipeListItem } from './recipe-list-item';

export const RECIPE_LIST_ID = 'recipe-list';

export async function recipeList(
  recipes: RecipeWithIngredients[],
  options: { swapOob?: HtmxSwapOobOption } = {},
) {
  const recipeComponents: string[] = [];
  for (const recipe of recipes) {
    recipeComponents.push(await recipeListItem(recipe));
  }

  const swapOobAttr = options.swapOob ? ' hx-swap-oob="true"' : '';

  return `
    <div 
      id="${RECIPE_LIST_ID}" 
      class="grid grid-cols-max-4 grid-row-flex gap-2"${swapOobAttr}
    >
      ${recipeComponents.join('')}
    </div>
  `;
}
