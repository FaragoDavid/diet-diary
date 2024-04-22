import { Ingredient } from '../../repository/ingredient.js';
import { RecipeWithIngredientName } from '../../repository/recipe.js';
import { amount } from '../amount.js';
import { RECIPE_INGREDIENT_LIST_ID } from './recipe-ingredient-list.js';

const texts = {
  newIngredient: 'Új hozzávaló hozzáadása',
  ingredientSelectorEmptyOption: 'Válassz',
};

export class NewRecipeIngredient implements BaseComponent {
  swap: boolean;
  constructor(private recipe: RecipeWithIngredientName, private ingredients: Ingredient[], options: { swap: boolean }) {
    this.swap = options.swap;
  }

  ingredientSelector() {
    const unusedIngredients = this.ingredients.filter(({ id }) => !this.recipe.ingredients.some((ingredient) => ingredient.id === id));

    return `
      <div class="flex justify-center">
        <select name="ingredientId" class="select select-bordered select-sm">
          <option disabled selected>${texts.ingredientSelectorEmptyOption}</option>
          ${unusedIngredients.map(({ id, name }) => `<option value="${id}" >${name}</option>`).join('')}
        </select>
      </div>
    `;
  }

  async render() {
    return `
      <div 
        id="new-recipe-ingredient" 
        class="flex flex-col items-center justify-center gap-4"
        ${this.swap ? 'hx-swap-oob="true"' : ''}
      >
        <div class="text">${texts.newIngredient}</div>
        <div id="hm" class="flex items-center justify-center gap-4">
          ${this.ingredientSelector()}
          ${amount({
            name: 'amount',
            hx: {
              verb: 'post',
              url: `/recipe/${this.recipe.id}/ingredient`,
              target: `#${RECIPE_INGREDIENT_LIST_ID}`,
              swap: 'beforeend',
              include: '[name=ingredientId]',
            },
          })}
        </div>
      </div>
    `;
  }
}
