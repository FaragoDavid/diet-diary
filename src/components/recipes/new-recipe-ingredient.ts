import { Ingredient } from '@prisma/client';

import { RecipeWithIngredients } from '../../repository/recipe.js';
import { amount } from '../amount.js';
import { IngredientSelector } from './ingredient-selector.js';
import { RECIPE_INGREDIENT_LIST_ID } from './recipe-ingredient-list.js';

const texts = {
  newIngredient: 'Új hozzávaló hozzáadása',
};

export class NewRecipeIngredient implements BaseComponent {
  swap: boolean;
  constructor(private recipe: RecipeWithIngredients, private ingredients: Ingredient[], options: { swap: boolean }) {
    this.swap = options.swap;
  }

  async render() {
    const recipeIngredientIds = this.recipe.ingredients.map(({ ingredient }) => ingredient.id);

    return `
      <div 
        id="new-recipe-ingredient" 
        class="flex flex-col items-center justify-center gap-4"
        ${this.swap ? 'hx-swap-oob="true"' : ''}
      >
        <div class="text">${texts.newIngredient}</div>
        <div id="hm" class="flex items-center justify-center gap-4">
          ${await new IngredientSelector(recipeIngredientIds, this.ingredients, { swapOob: false }).render()}
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
