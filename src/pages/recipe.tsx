import { Ingredient } from '@prisma/client';

import { backLink } from '../components/back-link';
import { recipeDetails } from '../components/recipes/recipe-details';
import { newRecipeHeader, recipeHeader } from '../components/recipes/recipe-header';
import { recipeIngredientList } from '../components/recipes/recipe-ingredient-list';
import { TAB_NAME } from '../components/tab-list';
import { RecipeWithIngredients } from '../repository/recipe';

export const RECIPE_PAGE_ID = 'recipe-page';
export class NewRecipePage {
  async render() {
    return `
      ${await backLink(TAB_NAME.recipes)}
      <div id="${RECIPE_PAGE_ID}" class="flex flex-col place-items-center w-full pt-6">
        ${newRecipeHeader()}
      </div>
    `;
  }
}

export class RecipePage {
  constructor(
    private recipe: RecipeWithIngredients,
    private ingredients: Ingredient[],
  ) {}

  async render() {
    return `
        ${await backLink(TAB_NAME.recipes)}
        <div id="${RECIPE_PAGE_ID}" class="flex flex-col place-items-center w-full pt-6">
          ${recipeHeader(this.recipe)}
          ${await recipeDetails(this.recipe, { swapOob: false })}
          ${await recipeIngredientList(this.recipe, this.ingredients, { layout: 'page', swapOob: false })}
        </div>
    `;
  }
}
