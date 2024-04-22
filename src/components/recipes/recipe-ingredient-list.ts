import { Ingredient } from '../../repository/ingredient.js';
import { RecipeWithIngredientName } from '../../repository/recipe.js';
import { RecipeIngredient } from './recipe-ingredient.js';


const texts = {
  ingredientsHeader: 'Alapanyagok',
};
export class RecipeIngredientList implements BaseComponent {
  constructor(private recipe: RecipeWithIngredientName, private ingredients: Ingredient[]) {}

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
        hx-post="/recipe/${this.recipe.id}/ingredient"
        hx-target="#recipe"
        hx-swap="outerHTML"
      >
        <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
      </input>
    </div>`;
  }

  addIngredient() {
    return `
      ${this.ingredientSelector()}
      ${this.newIngredientAmount()}`;
  }

  async render() {
    const recipeIngredientComponents: string[] = [];
    for (const ingredient of this.recipe.ingredients) {
      recipeIngredientComponents.push(await new RecipeIngredient(ingredient, this.recipe.id, this.ingredients).render());
    }

    return `
      <div class="divider px-4" ></div>
      <div id="recipe-ingredient-list-container">
        <div class="text-lg text-center pb-4">${texts.ingredientsHeader}</div>
        <div id="recipe-ingredient-list" class="grid grid-cols-max-3 grid-row-flex gap-2">
          ${recipeIngredientComponents.join('<div class="divider col-span-3 my-0" ></div>')}
          <div class="divider col-span-3 my-0" ></div>
          ${this.addIngredient()}
        </div>
      </div>
    `;
  }
}
