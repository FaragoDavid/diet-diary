import { Ingredient } from '../../repository/ingredient.js';
import { RecipeIngredient } from '../../repository/recipe.js';
import { swapOobTag } from '../../utils/swap-oob-wrapper.js';

const texts = {
  emptyOption: 'Válassz',
};

export class IngredientSelector implements BaseComponent {
  swapOob: HtmxSwapOobOption;
  constructor(private recipeIngredients: RecipeIngredient[], private ingredients: Ingredient[], options: { swapOob: HtmxSwapOobOption }) {
    this.swapOob = options.swapOob;
  }

  async render() {
    const unusedIngredients = this.ingredients.filter(({ id }) => !this.recipeIngredients.some((ingredient) => ingredient.id === id));

    return `
      <div 
        id="ingredient-selector"
        class="flex justify-center"
        ${swapOobTag(this.swapOob)}
      >
        <select name="ingredientId" class="select select-bordered select-sm">
          <option disabled selected>${texts.emptyOption}</option>
          ${unusedIngredients.map(({ id, name }) => `<option value="${id}" >${name}</option>`).join('')}
        </select>
      </div>
    `;
  }
}
