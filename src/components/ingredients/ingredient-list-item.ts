import { Ingredient } from '@prisma/client';

import icons from '../../utils/icons.js';
import { stats } from '../stats.js';
import { INGREDIENT_SEARCH_ID } from './ingredient-tab.js';

export class IngredientListItem {
  constructor(private ingredient: Ingredient) {}

  name() {
    return `<div class="text-sm text-wrap max-w-24">${this.ingredient.name}</div>`;
  }

  editButton() {
    return `
      <div class="flex justify-center items-center pl-2">
        <a 
          href="/ingredient/${this.ingredient.id}" 
          class="btn btn-xs btn-secondary"
        >${icons.edit}</a>
      </div>
    `;
  }

  deleteButton() {
    return `
      <div class="flex justify-center items-center">
        <div 
          class="btn btn-xs"
          hx-delete="/ingredient/${this.ingredient.id}" 
          hx-target="this"
          hx-swap="outerHTML"
          hx-vals="js:{query: document.getElementById('${INGREDIENT_SEARCH_ID}').value}"
        >${icons.delete}</div>
      </div>
    `;
  }

  async render() {
    return `
      ${this.name()}
      ${stats(
        {
          cal: this.ingredient.caloriesPer100 || 0,
          carbs: this.ingredient.carbsPer100 || 0,
          fat: this.ingredient.fatPer100 || 0,
        },
        { layout: 'cells', size: 'sm', swapOob: false },
      )}
      ${this.editButton()}
      ${this.deleteButton()}
    `;
  }
}
