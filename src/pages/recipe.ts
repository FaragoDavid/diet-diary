import { Ingredient } from '@prisma/client';

import { BackLink } from '../components/back-link';
import { RecipeDetails } from '../components/recipes/recipe-details';
import { newRecipeHeader, recipeHeader } from '../components/recipes/recipe-header';
import { RecipeIngredientList } from '../components/recipes/recipe-ingredient-list';
import { TAB_NAME } from '../components/tab-list';
import { RecipeWithIngredients } from '../repository/recipe';

export const RECIPE_PAGE_ID = 'recipe-page';
export class NewRecipePage implements BaseComponent {
  async render() {
    return `
      ${await new BackLink(TAB_NAME.recipes).render()}
      <div id="${RECIPE_PAGE_ID}" class="flex flex-col place-items-center w-full pt-6">
        ${newRecipeHeader()}
      </div>
    `;
  }
}

export class RecipePage implements BaseComponent {
  constructor(private recipe: RecipeWithIngredients, private ingredients: Ingredient[]) {}

  async render() {
    return `
        ${await new BackLink(TAB_NAME.recipes).render()}
        <div id="${RECIPE_PAGE_ID}" class="flex flex-col place-items-center w-full pt-6">
          ${recipeHeader(this.recipe)}
          ${await new RecipeDetails(this.recipe, { swapOob: false }).render()}
          ${await new RecipeIngredientList(this.recipe, this.ingredients, { layout: 'page', swapOob: false }).render()}
        </div>
    `;
  }
}
