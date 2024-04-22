import { Ingredient } from '../../repository/ingredient.js';
import { RecipeWithIngredientName } from '../../repository/recipe.js';
import { amount } from '../amount.js';
import { RECIPE_INGREDIENT_LIST_ID } from './recipe-ingredient-list.js';

const texts = {
  newIngredient: 'Új hozzávaló hozzáadása',
};

export class NewRecipeIngredient implements BaseComponent {
  constructor(private recipe: RecipeWithIngredientName, private ingredients: Ingredient[]) {}

  ingredientSelector() {
    const unusedIngredients = this.ingredients.filter(({ id }) => !this.recipe.ingredients.some((ingredient) => ingredient.id === id));

    return `
      <div class="flex justify-center">
        <select name="newIngredient" class="select select-bordered select-sm">
          ${unusedIngredients.map(({ id, name }) => `<option value="${id}" >${name}</option>`).join('')}
        </select>
      </div>
    `;
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
      </div>
    `;
  }

  async render() {
    return `
      <div class="flex flex-col items-center justify-center gap-4">
      <div class="text">${texts.newIngredient}</div>
      <div class="flex items-center justify-center gap-4">
        ${this.ingredientSelector()}
        ${amount({
          name: 'newIngredient',
          hx: { verb: 'post', url: `/recipe/${this.recipe.id}/ingredient`, target: `#${RECIPE_INGREDIENT_LIST_ID}`, swap: 'outerHTML' },
        })}
      </div>
    `;
  }
}
