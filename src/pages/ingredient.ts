import { Ingredient } from '@prisma/client';

import { BackLink } from '../components/back-link';
import { IngredientDetails } from '../components/ingredients/ingredient-details';
import { ingredientHeader, newIngredientHeader } from '../components/ingredients/ingredient-header';
import { TAB_NAME } from '../components/tab-list';

export const INGREDIENT_PAGE_ID = 'ingredient-page';
const texts = {
  newIngredient: 'Új Alapanyag',
};

export class NewIngredientPage implements BaseComponent {
  async render() {
    return `
      ${await new BackLink(TAB_NAME.ingredients).render()}
      <div id="${INGREDIENT_PAGE_ID}" class="flex flex-col place-items-center w-full gap-4 pt-6">
        <div class="text-2xl text-primary">${texts.newIngredient}</div>
        ${newIngredientHeader()}
      </div>
    `;
  }
}

export class IngredientPage implements BaseComponent {
  constructor(private ingredient: Ingredient) {}

  async render() {
    return `
      ${await new BackLink(TAB_NAME.ingredients).render()}
      <div id="${INGREDIENT_PAGE_ID}" class="flex flex-col place-items-center w-full gap-4 pt-6">
        ${ingredientHeader(this.ingredient)}
        ${await new IngredientDetails(this.ingredient).render()}
      </div>
    `;
  }
}
