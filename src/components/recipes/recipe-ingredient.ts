import { Ingredient } from '../../repository/ingredient.js';
import { RecipeIngredientWithName } from '../../repository/recipe.js';
import { stats } from '../stats.js';
import icons from '../../utils/icons.js';

export class RecipeIngredient implements BaseComponent {
  ingredientCals: number;
  ingredientCarbs: number;
  ingredientFat: number;
  constructor(private ingredient: RecipeIngredientWithName, private recipeId: string, private ingredients: Ingredient[]) {
    const ingredientWithMacros = this.ingredients.find(({ id }) => id === this.ingredient.id);
    if (!ingredientWithMacros) throw new Error('Ingredient not found');
    this.ingredientCals = ingredientWithMacros.calories * this.ingredient.amount;
    this.ingredientCarbs = ingredientWithMacros.carbs * this.ingredient.amount;
    this.ingredientFat = ingredientWithMacros.fat * this.ingredient.amount;
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

  ingredientAmount() {
    return `
    <div class="flex justify-center items-center">
      <input 
        type="number"
        name="${this.ingredient.id}" 
        class="input input-sm input-bordered w-16 pr-5 text-right" 
        value="${this.ingredient.amount}"
        hx-post="/recipe/${this.recipeId}/ingredient/${this.ingredient.id}"
        hx-target="#recipe"
        hx-swap="outerHTML"
      >
        <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
      </input>
    </div>`;
  }

  deleteIngredient() {
    return `
    <div class="flex justify-center items-center row-span-2">
      <button 
        type="button"
        class="btn btn-primary btn-sm"
        hx-delete="/recipe/${this.recipeId}/ingredient/${this.ingredient.id}"
        hx-target="#recipe"
        hx-swap="outerHTML"
      />
      ${icons.delete}
    </div>`;
  }

  async render() {
    return `
      ${this.ingredientName()}
      ${this.ingredientAmount()}
      ${this.deleteIngredient()}
      ${stats(
        { cal: this.ingredientCals, carbs: this.ingredientCarbs, fat: this.ingredientFat },
        { id: `ingredient-${this.ingredient.id}-stats`, orientation: 'horizontal', size: 'sm' },
      )}
      `;
  }
}
