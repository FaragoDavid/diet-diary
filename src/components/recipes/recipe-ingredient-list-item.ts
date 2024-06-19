import { Ingredient } from '@prisma/client';

import icons from '../../utils/icons.js';
import { amount } from '../amount.js';
import { stats } from '../stats.js';
import { recipeIngredientDivider } from './recipe-ingredient-list.js';

export class RecipeIngredientListItem implements BaseComponent {
  ingredientCals: number;
  ingredientCarbs: number;
  ingredientFat: number;
  isFirst: boolean;
  constructor(
    private amount: number,
    private ingredient: Ingredient,
    private recipeId: string,
    options: { isFirst: boolean },
  ) {
    this.ingredientCals = (ingredient.caloriesPer100 || 0) / 100 * this.amount;
    this.ingredientCarbs = (ingredient.carbsPer100 || 0) / 100 * this.amount;
    this.ingredientFat = (ingredient.fatPer100 || 0) / 100 * this.amount;
    this.isFirst = options.isFirst;
  }

  ingredientName() {
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
      </div>`;
  }

  deleteIngredient() {
    return `
    <div class="flex justify-center items-center row-span-2">
      <button 
        type="button"
        class="btn btn-primary btn-sm"
        hx-delete="/recipe/${this.recipeId}/ingredient/${this.ingredient.id}"
        hx-target="this"
        hx-swap="outerHTML"
      />
      ${icons.delete}
    </div>`;
  }

  async render() {
    return `
      ${!this.isFirst ? recipeIngredientDivider : ''}
      ${this.ingredientName()}
      ${amount({
        amount: this.amount,
        name: 'amount',
        hx: { verb: 'post', url: `/recipe/${this.recipeId}/ingredient/${this.ingredient.id}` },
      })}
      ${this.deleteIngredient()}
      ${stats(
        { cal: this.ingredientCals, carbs: this.ingredientCarbs, fat: this.ingredientFat },
        { id: `ingredient-${this.ingredient.id}-stats`, layout: 'horizontal', size: 'sm', span: 'col-span-2'},
      )}
    `;
  }
}
