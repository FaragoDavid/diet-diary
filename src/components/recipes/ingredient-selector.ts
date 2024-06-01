import { Ingredient } from '@prisma/client';

import { swapOobTag } from '../../utils/swap-oob-wrapper.js';

const texts = {
  emptyOption: 'Válassz',
};

export class IngredientSelector implements BaseComponent {
  swapOob: HtmxSwapOobOption;
  constructor(private recipeIngredientIds: string[], private ingredients: Ingredient[], options: { swapOob: HtmxSwapOobOption }) {
    this.swapOob = options.swapOob;
  }

  async render() {
    const unusedIngredients = this.ingredients.filter(
      (ingredient) => !this.recipeIngredientIds.some((recipeIngredientId) => recipeIngredientId === ingredient.id),
    );

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
