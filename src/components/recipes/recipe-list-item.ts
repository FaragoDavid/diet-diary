import { Ingredient } from '@prisma/client';

import { RecipeWithIngredients } from '../../repository/recipe.js';
import icons from '../../utils/icons.js';
import { amount as amountInput } from '../amount.js';
import { RecipeStats } from './recipe-stats.js';
import { RECIPE_SEARCH_ID } from './recipe-tab.js';

export class RecipeListItem implements BaseComponent {
  constructor(private recipe: RecipeWithIngredients, private ingredients: Ingredient[]) {}

  name() {
    return `<div class="text">${this.recipe.name}</div>`;
  }

  amount() {
    return amountInput({
      amount: this.recipe.amount || 0,
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
          class="btn btn-sm btn-secondary"
        >${icons.edit}</a>
      </div>
    `;
  }

  deleteButton() {
    return `
      <div class="flex justify-center items-center row-span-2">
        <div 
          class="btn btn-sm"
          hx-delete="/recipe/${this.recipe.id}" 
          hx-target="this"
          hx-swap="outerHTML"
          hx-vals="js:{query: document.getElementById('${RECIPE_SEARCH_ID}').value}"
        >${icons.delete}</div>
      </div>
    `;
  }

  async render() {
    return `
      ${this.name()}
      ${this.amount()}
      ${this.editButton()}
      ${this.deleteButton()}
      ${await new RecipeStats(this.recipe, {
        id: `recipe-${this.recipe.id}-stats`,
        layout: 'horizontal',
        size: 'sm',
        span: 'col-span-2',
        swapOob: false,
      }).render()}
    `;
  }
}
