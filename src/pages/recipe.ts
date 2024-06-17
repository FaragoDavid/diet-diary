import { Ingredient } from '@prisma/client';

import { BackLink } from '../components/back-link.js';
import { RecipeDetails } from '../components/recipes/recipe-details.js';
import { newRecipeHeader, recipeHeader } from '../components/recipes/recipe-header.js';
import { RecipeIngredientList } from '../components/recipes/recipe-ingredient-list.js';
import { TAB_NAME } from '../components/tab-list.js';
import { RecipeWithIngredients } from '../repository/recipe.js';

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
          ${await new RecipeDetails(this.recipe, { swap: false }).render()}
          ${await new RecipeIngredientList(this.recipe, this.ingredients, { layout: 'container', swap: false }).render()}
        </div>
    `;
  }
}
