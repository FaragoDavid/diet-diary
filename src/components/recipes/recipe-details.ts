import { RecipeWithIngredients } from '../../repository/recipe.js';
import { amount } from '../amount.js';
import { stats } from '../stats.js';
import { RecipeStats } from './recipe-stats.js';

export class RecipeDetails implements BaseComponent {
  recipeAmount: number;
  swapOob: HtmxSwapOobOption;
  constructor(private recipe: RecipeWithIngredients, options: { swapOob: HtmxSwapOobOption }) {
    this.recipeAmount = this.recipe.amount || this.recipe.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
    this.swapOob = options.swapOob;
  }

  async render() {
    return `
      <div 
        id="recipe-details" 
        class="grid grid-rows-max-1 grid-flow-col gap-3"
        ${this.swapOob ? 'hx-swap-oob="true"' : ''}
      >
        ${amount({
          amount: this.recipeAmount,
          name: 'amount',
          showText: true,
          hx: {
            verb: 'post',
            url: `/recipe/${this.recipe.id}/amount`,
          },
        })}
        <div class="divider divider-horizontal" ></div> 
        ${await new RecipeStats(this.recipe, { id: `recipe-${this.recipe.id}-stats`, layout: 'vertical', size: 'lg' }).render()}
      </div>
    `;
  }
}
