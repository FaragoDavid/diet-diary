import icons from '../../utils/icons.js';
import { Ingredient, selectIngredients } from '../../repository/ingredient.js';
import { RecipeIngredientWithName, selectRecipe } from '../../repository/recipe.js';
import { stats } from '../stats.js';

export class RecipeIngredientList implements BaseComponent {
  private ingredients: Ingredient[] = [];
  constructor(private id: string) {}

  ingredientName(ingredientId: string, ingredientName: string) {
    return `
      <div class="flex justify-center">
        <input 
          type="text" 
          name="${ingredientId}" 
          class="input input-bordered input-sm max-w-32 sm:max-w-full disabled:text-neutral"
          readonly disabled
          value="${ingredientName}"
          placeholder="Alapanyag neve"
        />
      </div>`;
  }

  ingredientAmount(ingredientId: string, ingredientAmount: number) {
    return `
    <div class="flex justify-center items-center">
      <input 
        type="number"
        name="${ingredientId}" 
        class="input input-sm input-bordered w-16 pr-5 text-right" 
        value="${ingredientAmount}"
        hx-post="/recipe/${this.id}/ingredient/${ingredientId}"
        hx-target="#recipe"
        hx-swap="outerHTML"
      >
        <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
      </input>
    </div>`;
  }

  deleteIngredient(ingredientId: string) {
    return `
    <div class="flex justify-center items-center row-span-2">
      <button 
        type="button"
        class="btn btn-primary btn-sm"
        hx-delete="/recipe/${this.id}/ingredient/${ingredientId}"
        hx-target="#recipe"
        hx-swap="outerHTML"
      />
      ${icons.delete}
    </div>`;
  }

  ingredientSelector() {
    return `
    <div class="flex justify-center">
      <select name="newIngredient" class="select select-bordered select-sm max-w-32 sm:max-w-full">
        ${this.ingredients.map(({ id, name }) => `<option value="${id}" >${name}</option>`).join('')}
      </select>
    </div>`;
  }

  newIngredientAmount() {
    return `
    <div class="flex justify-center items-center">
      <input 
        type="number"
        name="newIngredient"
        class="input input-sm input-bordered w-16 pr-5 text-right placeholder:text-neutral peer" 
        placeholder="0"
        hx-post="/recipe/${this.id}/ingredient"
        hx-target="#recipe"
        hx-swap="outerHTML"
      >
        <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
      </input>
    </div>`;
  }

  renderIngredient({ id, name, amount }: RecipeIngredientWithName) {
    const fullIngredient = this.ingredients.find((ingr) => ingr.id === id);
    if (!fullIngredient) return '';
    const macros = { cal: fullIngredient.calories * amount, carbs: fullIngredient.carbs * amount, fat: fullIngredient.fat * amount };

    return `
      ${this.ingredientName(id, name)}
      ${this.ingredientAmount(id, amount)}
      ${this.deleteIngredient(id)}
      ${stats(
        { cal: macros.cal, carbs: macros.carbs, fat: macros.fat },
        { id: `ingredient-${id}-stats`, orientation: 'horizontal', size: 'sm' },
      )}
      `;
  }

  addIngredient() {
    return `
      ${this.ingredientSelector()}
      ${this.newIngredientAmount()}`;
  }

  async render() {
    const recipe = await selectRecipe(this.id);
    if (!recipe) return 'Error: Recipe not found';

    this.ingredients = await selectIngredients();

    return `
      <form id="recipe-ingredient-list" class="grid grid-cols-max-3 grid-row-flex gap-2">
        ${recipe.ingredients.map((ingredient) => this.renderIngredient(ingredient)).join('<div class="divider col-span-3 my-0" ></div>')}
        <div class="divider col-span-3 my-0" ></div>
        ${this.addIngredient()}
      </form>
    `;
  }
}
