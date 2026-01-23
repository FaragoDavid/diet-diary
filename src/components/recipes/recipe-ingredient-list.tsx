import { Ingredient } from '@prisma/client';
import { RecipeWithIngredients } from '../../repository/recipe';
import { newRecipeIngredient } from './new-recipe-ingredient';
import { recipeIngredientListItem } from './recipe-ingredient-list-item';
import { texts } from '../../constants/texts';

export const RECIPE_INGREDIENT_LIST_ID = 'recipe-ingredient-list';
export const recipeIngredientDivider = '<div class="divider col-span-3 my-0 divider-secondary"></div>';

type Layout = 'list' | 'page';

export async function recipeIngredientList(
  recipe: RecipeWithIngredients,
  ingredients: Ingredient[],
  options: { layout?: Layout; swapOob?: HtmxSwapOobOption } = { layout: 'page' },
) {
  const renderList = async () => {
    const recipeIngredientComponents: string[] = [];
    for (let ingrIndex = 0; ingrIndex < recipe.ingredients.length; ingrIndex++) {
      const { amount, ingredient } = recipe.ingredients[ingrIndex]!;
      recipeIngredientComponents.push(await recipeIngredientListItem(amount, ingredient, recipe.id, { isFirst: ingrIndex === 0 }));
    }

    const swapOobAttr = options.swapOob ? ' hx-swap-oob="true"' : '';

    return `
      <div 
        id="${RECIPE_INGREDIENT_LIST_ID}" 
        class="grid grid-cols-max-3 grid-row-flex gap-2 pb-4"${swapOobAttr}
      >
        ${recipeIngredientComponents.join('')}
      </div>
    `;
  };

  const renderContainer = async () => {
    const listHtml = await renderList();
    const newIngredientHtml = await newRecipeIngredient(recipe, ingredients, { swapOob: false });

    return `
      <div class="divider px-4"></div>
      <div id="recipe-ingredient-list-container">
        <div class="text-lg text-center pb-4">${texts.recipes.ingredientsHeader}</div>
        ${listHtml}
        ${newIngredientHtml}
      </div>
    `;
  };

  const layout = options.layout || 'page';
  switch (layout) {
    case 'list':
      return renderList();
    case 'page':
      return renderContainer();
  }
}
