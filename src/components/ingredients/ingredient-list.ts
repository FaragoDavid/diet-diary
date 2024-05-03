import { Ingredient } from '../../repository/ingredient.js';
import { swapOobTag } from '../../utils/swap-oob-wrapper.js';
import { IngredientListItem } from './ingredient-list-item.js';

export const INGREDIENT_LIST_ID = 'ingredient-list';

export class IngredientList implements BaseComponent {
  swapOob: HtmxSwapOobOption;
  constructor(private ingredients: Ingredient[], options: { swapOob: HtmxSwapOobOption }) {
    this.swapOob = options.swapOob;
  }

  async render() {
    let ingredientComponents: string[] = [];
    for (const ingredient of this.ingredients) {
      ingredientComponents.push(await new IngredientListItem(ingredient).render());
    }

    return `
      <div 
        id="${INGREDIENT_LIST_ID}" 
        class="grid grid-cols-max-6 grid-row-flex gap-2 items-center"
        ${swapOobTag(this.swapOob)}
      >
        ${ingredientComponents.join('<div class="divider m-0 col-span-6"></div>')}
      </div>
    `;
  }
}
