import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';

import icons from '../../utils/icons';
import { amount } from '../amount';
import { stats } from '../stats';
import { recipeIngredientDivider } from './recipe-ingredient-list';

export class RecipeIngredientListItem {
  ingredientCals: number;
  ingredientCarbs: number;
  ingredientFat: number;
  constructor(
    private amount: number,
    private ingredient: Ingredient,
    private recipeId: string,
    private options: { isFirst?: boolean } = {},
  ) {
    this.ingredientCals = ((ingredient.caloriesPer100 || 0) / 100) * this.amount;
    this.ingredientCarbs = ((ingredient.carbsPer100 || 0) / 100) * this.amount;
    this.ingredientFat = ((ingredient.fatPer100 || 0) / 100) * this.amount;
  }

  ingredientName(): string {
    return `
      <div class="flex justify-center">
        <input 
          type="text" 
          name="${this.ingredient.id}" 
          class="input input-bordered input-sm max-w-32 sm:max-w-full disabled:text-neutral"
          readonly disabled
          value="${this.ingredient.name}"
          placeholder="Alapanyag neve"
        />
      </div>
    `;
  }

  deleteIngredient(): string {
    return `
      <div class="flex justify-center items-center row-span-2">
        <button 
          type="button"
          class="btn btn-primary btn-sm"
          hx-delete="/recipe/${this.recipeId}/ingredient/${this.ingredient.id}"
          hx-target="this"
          hx-swap="outerHTML"
        >${icons.delete}</button>
      </div>
    `;
  }

  async render() {
    const amountHtml = amount({
      amount: this.amount,
      name: 'amount',
      hx: { verb: 'post', url: `/recipe/${this.recipeId}/ingredient/${this.ingredient.id}` },
    });

    const statsHtml = stats(
      { cal: this.ingredientCals, carbs: this.ingredientCarbs, fat: this.ingredientFat },
      { id: `ingredient-${this.ingredient.id}-stats`, layout: 'horizontal', size: 'sm', span: 'col-span-2' },
    );

    return `
      ${!this.options.isFirst ? recipeIngredientDivider : ''}
      ${this.ingredientName()}
      ${amountHtml}
      ${this.deleteIngredient()}
      ${statsHtml}
    `;
  }
}
