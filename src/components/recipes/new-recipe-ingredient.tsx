import { Ingredient } from '@prisma/client';
import { RecipeWithIngredients } from '../../repository/recipe';
import { HTMX_SWAP } from '../../utils/htmx';
import { swapOobWrapper } from '../../utils/swap-oob-wrapper';
import { amount } from '../amount';
import { ingredientSelector } from './ingredient-selector';
import { RECIPE_INGREDIENT_LIST_ID } from './recipe-ingredient-list';
import { texts } from '../../constants/texts';

const NEW_RECIPE_INGREDIENT_ID = 'new-recipe-ingredient';

export async function newRecipeIngredient(
  recipe: RecipeWithIngredients,
  ingredients: Ingredient[],
  options: { swapOob?: HtmxSwapOobOption } = {},
) {
  const recipeIngredientIds = recipe.ingredients.map(({ ingredient }) => ingredient.id);

  const selectorHtml = await ingredientSelector(recipeIngredientIds, ingredients, { swapOob: false });
  const amountHtml = amount({
    name: 'amount',
    hx: {
      verb: 'post',
      url: `/recipe/${recipe.id}/ingredient`,
      target: `#${RECIPE_INGREDIENT_LIST_ID}`,
      swap: HTMX_SWAP.AfterLastChild,
      include: '[name=ingredientId]',
    },
  });

  const template = `
    <div class="flex flex-col items-center justify-center gap-4">
      <div class="text">${texts.recipes.newIngredient}</div>
      <div id="hm" class="flex items-center justify-center gap-4">
        ${selectorHtml}
        ${amountHtml}
      </div>
    </div>
  `;

  if (options.swapOob) return swapOobWrapper(NEW_RECIPE_INGREDIENT_ID, options.swapOob, template);
  return template;
}
