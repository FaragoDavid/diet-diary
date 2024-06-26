import { Ingredient } from '@prisma/client';

import { RecipeWithIngredients } from '../../repository/recipe.js';
import { HTMX_SWAP } from '../../utils/htmx.js';
import { swapOobWrapper } from '../../utils/swap-oob-wrapper.js';
import { amount } from '../amount.js';
import { IngredientSelector } from './ingredient-selector.js';
import { RECIPE_INGREDIENT_LIST_ID } from './recipe-ingredient-list.js';

const NEW_RECIPE_INGREDIENT_ID = 'new-recipe-ingredient';
const texts = {
  newIngredient: 'Új alapanyag hozzáadása',
};

export class NewRecipeIngredient implements BaseComponent {
  swapOob: HtmxSwapOobOption;
  constructor(private recipe: RecipeWithIngredients, private ingredients: Ingredient[], options: { swapOob: HtmxSwapOobOption }) {
    this.swapOob = options.swapOob;
  }

  async render() {
    const recipeIngredientIds = this.recipe.ingredients.map(({ ingredient }) => ingredient.id);

    const template = `
      <div class="flex flex-col items-center justify-center gap-4" >
        <div class="text">${texts.newIngredient}</div>
        <div id="hm" class="flex items-center justify-center gap-4">
          ${await new IngredientSelector(recipeIngredientIds, this.ingredients, { swapOob: false }).render()}
          ${amount({
            name: 'amount',
            hx: {
              verb: 'post',
              url: `/recipe/${this.recipe.id}/ingredient`,
              target: `#${RECIPE_INGREDIENT_LIST_ID}`,
              swap: HTMX_SWAP.AfterLastChild,
              include: '[name=ingredientId]',
            },
          })}
        </div>
      </div>
    `;

    if (this.swapOob) return swapOobWrapper(NEW_RECIPE_INGREDIENT_ID, this.swapOob, template);
    return template;
  }
}
