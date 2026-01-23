import * as elements from 'typed-html';
import { RecipeWithIngredients } from '../../repository/recipe';
import { amount } from '../amount';
import { recipeStats } from './recipe-stats';

export async function recipeDetails(recipe: RecipeWithIngredients, options: { swapOob?: HtmxSwapOobOption } = {}) {
  const recipeAmount = recipe.amount || recipe.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);

  const attrs: any = {
    id: 'recipe-details',
    class: 'grid grid-rows-max-1 grid-flow-col gap-3',
  };
  if (options.swapOob) attrs['hx-swap-oob'] = 'true';

  const amountHtml = amount({
    amount: recipeAmount,
    name: 'amount',
    showText: true,
    hx: {
      verb: 'post',
      url: `/recipe/${recipe.id}/amount`,
    },
  });

  const statsHtml = await recipeStats(recipe, { id: `recipe-${recipe.id}-stats`, layout: 'vertical', size: 'lg' });

  return `
    <div ${Object.entries(attrs)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ')}>
      ${amountHtml}
      <div class="divider divider-horizontal"></div> 
      ${statsHtml}
    </div>
  `;
}
