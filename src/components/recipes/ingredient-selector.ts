import { Ingredient } from "../../repository/ingredient.js";
import { RecipeIngredient } from "../../repository/recipe.js";

const texts = {
  emptyOption: 'Válassz',
};

export class IngredientSelector implements BaseComponent {
  swap: boolean;
  constructor(private recipeIngredients: RecipeIngredient[], private ingredients: Ingredient[], options: {swap: boolean}) {
    this.swap = options.swap;
  }

  async render() {
    const unusedIngredients = this.ingredients.filter(({ id }) => !this.recipeIngredients.some((ingredient) => ingredient.id === id));

    return `
      <div 
        id="ingredient-selector"
        class="flex justify-center"
        ${this.swap ? 'hx-swap-oob="true"' : ''}
      >
        <select name="ingredientId" class="select select-bordered select-sm">
          <option disabled selected>${texts.emptyOption}</option>
          ${unusedIngredients.map(({ id, name }) => `<option value="${id}" >${name}</option>`).join('')}
        </select>
      </div>
    `;
  }
}