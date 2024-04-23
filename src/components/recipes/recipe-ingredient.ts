import { Ingredient } from '../../repository/ingredient.js';
import { RecipeIngredientWithName } from '../../repository/recipe.js';
import icons from '../../utils/icons.js';
import { amount } from '../amount.js';
import { stats } from '../stats.js';
import { recipeIngredientDivider } from './recipe-ingredient-list.js';

export class RecipeIngredient implements BaseComponent {
  ingredientCals: number;
  ingredientCarbs: number;
  ingredientFat: number;
  isFirst: boolean;
  constructor(private ingredient: RecipeIngredientWithName, private recipeId: string, private ingredients: Ingredient[], options: {isFirst: boolean}) {
    const ingredientWithMacros = this.ingredients.find(({ id }) => id === this.ingredient.id);
    if (!ingredientWithMacros) throw new Error('Ingredient not found');
    this.ingredientCals = ingredientWithMacros.calories * this.ingredient.amount;
    this.ingredientCarbs = ingredientWithMacros.carbs * this.ingredient.amount;
    this.ingredientFat = ingredientWithMacros.fat * this.ingredient.amount;
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
        amount: this.ingredient.amount,
        name: 'amount',
        hx: { verb: 'post', url: `/recipe/${this.recipeId}/ingredient/${this.ingredient.id}` },
      })}
      ${this.deleteIngredient()}
      ${stats(
        { cal: this.ingredientCals, carbs: this.ingredientCarbs, fat: this.ingredientFat },
        { id: `ingredient-${this.ingredient.id}-stats`, orientation: 'horizontal', size: 'sm' },
      )}
      `;
  }
}
