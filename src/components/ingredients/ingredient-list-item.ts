import icons from '../../utils/icons.js';
import { Ingredient } from '../../repository/ingredient.js';
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
          cal: this.ingredient.calories * 100,
          carbs: this.ingredient.carbs * 100,
          fat: this.ingredient.fat * 100,
        },
        { layout: 'cells', size: 'sm', swap: false },
      )}
      ${this.editButton()}
      ${this.deleteButton()}
    `;
  }
}
