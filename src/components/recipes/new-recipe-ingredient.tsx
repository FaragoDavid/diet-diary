import { Ingredient } from '@prisma/client';
import { RecipeWithIngredients } from '../../repository/recipe';
import { HTMX_SWAP } from '../../utils/htmx';
import { swapOobWrapper } from '../../utils/swap-oob-wrapper';
import { amount } from '../amount';
import { IngredientSelector } from './ingredient-selector';
import { RECIPE_INGREDIENT_LIST_ID } from './recipe-ingredient-list';

const NEW_RECIPE_INGREDIENT_ID = 'new-recipe-ingredient';
const texts = {
  newIngredient: 'Új alapanyag hozzáadása',
};

export class NewRecipeIngredient {
  constructor(
    private recipe: RecipeWithIngredients,
    private ingredients: Ingredient[],
    private options: { swapOob?: HtmxSwapOobOption } = {},
  ) {}

  async render(): Promise<string> {
    const recipeIngredientIds = this.recipe.ingredients.map(({ ingredient }) => ingredient.id);

    const selectorHtml = await new IngredientSelector(recipeIngredientIds, this.ingredients, { swapOob: false }).render();
    const amountHtml = amount({
      name: 'amount',
      hx: {
        verb: 'post',
        url: `/recipe/${this.recipe.id}/ingredient`,
        target: `#${RECIPE_INGREDIENT_LIST_ID}`,
        swap: HTMX_SWAP.AfterLastChild,
        include: '[name=ingredientId]',
      },
    });

    const template = `
      <div class="flex flex-col items-center justify-center gap-4">
        <div class="text">${texts.newIngredient}</div>
        <div id="hm" class="flex items-center justify-center gap-4">
          ${selectorHtml}
          ${amountHtml}
        </div>
      </div>
    `;

    if (this.options.swapOob) return swapOobWrapper(NEW_RECIPE_INGREDIENT_ID, this.options.swapOob, template);
    return template;
  }
}
