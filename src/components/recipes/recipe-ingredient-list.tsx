import { Ingredient } from '@prisma/client';
import { RecipeWithIngredients } from '../../repository/recipe';
import { NewRecipeIngredient } from './new-recipe-ingredient';
import { RecipeIngredientListItem } from './recipe-ingredient-list-item';

export const RECIPE_INGREDIENT_LIST_ID = 'recipe-ingredient-list';
export const recipeIngredientDivider = '<div class="divider col-span-3 my-0 divider-secondary"></div>';

const texts = {
  ingredientsHeader: 'Alapanyagok',
};

type Layout = 'list' | 'page';

export class RecipeIngredientList {
  layout: Layout;
  swapOob: HtmxSwapOobOption;
  constructor(
    private recipe: RecipeWithIngredients,
    private ingredients: Ingredient[],
    options: { layout: Layout; swapOob: HtmxSwapOobOption },
  ) {
    this.layout = options.layout;
    this.swapOob = options.swapOob;
  }

  async renderList(): Promise<string> {
    const recipeIngredientComponents: string[] = [];
    for (let ingrIndex = 0; ingrIndex < this.recipe.ingredients.length; ingrIndex++) {
      const { amount, ingredient } = this.recipe.ingredients[ingrIndex]!;
      recipeIngredientComponents.push(
        await new RecipeIngredientListItem(amount, ingredient, this.recipe.id, { isFirst: ingrIndex === 0 }).render(),
      );
    }

    const swapOobAttr = this.swapOob ? ' hx-swap-oob="true"' : '';

    return `
      <div 
        id="${RECIPE_INGREDIENT_LIST_ID}" 
        class="grid grid-cols-max-3 grid-row-flex gap-2 pb-4"${swapOobAttr}
      >
        ${recipeIngredientComponents.join('')}
      </div>
    `;
  }

  async renderContainer(): Promise<string> {
    const listHtml = await this.renderList();
    const newIngredientHtml = await new NewRecipeIngredient(this.recipe, this.ingredients, { swapOob: false }).render();

    return `
      <div class="divider px-4"></div>
      <div id="recipe-ingredient-list-container">
        <div class="text-lg text-center pb-4">${texts.ingredientsHeader}</div>
        ${listHtml}
        ${newIngredientHtml}
      </div>
    `;
  }

  async render(): Promise<string> {
    switch (this.layout) {
      case 'list':
        return this.renderList();
      case 'page':
        return this.renderContainer();
    }
  }
}
