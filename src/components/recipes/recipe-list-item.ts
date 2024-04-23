import { Ingredient } from '../../repository/ingredient.js';
import { Recipe } from '../../repository/recipe.js';
import icons from '../../utils/icons.js';
import { amount as amountInput } from '../amount.js';
import { RecipeStats } from './recipe-stats.js';

export class RecipeListItem implements BaseComponent {
  constructor(private recipe: Recipe, private ingredients: Ingredient[]) {}

  name() {
    return `<div class="text">${this.recipe.name}</div>`;
  }

  amount() {
    return amountInput({
      amount: this.recipe.amount,
      name: 'amount',
      showText: false,
      hx: { verb: 'post', url: `/recipe/${this.recipe.id}/amount` },
    });
  }

  editButton() {
    return `
      <div class="flex justify-center items-center row-span-2">
        <a 
          href="/recipe/${this.recipe.id}" 
          class="btn btn-sm btn-primary"
        >${icons.edit}</a>
      </div>
    `;
  }

  async render() {
    return `
      ${this.name()}
      ${this.amount()}
      ${this.editButton()}
      ${await new RecipeStats(this.recipe, this.ingredients, { id: `recipe-${this.recipe.id}-stats`, swap: false }).render()}
    `;
  }
}
