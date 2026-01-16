import * as elements from 'typed-html';
import { RecipeWithIngredients } from '../../repository/recipe';
import { amount } from '../amount';
import { RecipeStats } from './recipe-stats';

export class RecipeDetails {
  recipeAmount: number;
  constructor(
    private recipe: RecipeWithIngredients,
    private options: { swapOob?: HtmxSwapOobOption } = {},
  ) {
    this.recipeAmount = this.recipe.amount || this.recipe.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
  }

  async render(): Promise<string> {
    const attrs: any = {
      id: 'recipe-details',
      class: 'grid grid-rows-max-1 grid-flow-col gap-3',
    };
    if (this.options.swapOob) attrs['hx-swap-oob'] = 'true';

    const amountHtml = amount({
      amount: this.recipeAmount,
      name: 'amount',
      showText: true,
      hx: {
        verb: 'post',
        url: `/recipe/${this.recipe.id}/amount`,
      },
    });

    const statsHtml = await new RecipeStats(this.recipe, { id: `recipe-${this.recipe.id}-stats`, layout: 'vertical', size: 'lg' }).render();

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
}
