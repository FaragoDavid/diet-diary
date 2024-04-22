import { BackLink } from '../components/back-link.js';
import { RecipeDetails } from '../components/recipes/recipe-details.js';
import { newRecipeHeader, recipeHeader } from '../components/recipes/recipe-header.js';
import { RecipeIngredientList } from '../components/recipes/recipe-ingredient-list.js';
import { Ingredient } from '../repository/ingredient.js';
import { RecipeWithIngredientName } from '../repository/recipe.js';

export const RECIPE_PAGE_ID = 'recipe-page';
export class NewRecipePage implements BaseComponent {
  async render() {
    return `
      ${await new BackLink().render()}
      <div id="${RECIPE_PAGE_ID}" class="flex flex-col place-items-center w-full pt-6">
        ${newRecipeHeader()}
      </div>
    `;
  }
}

export class RecipePage implements BaseComponent {
  constructor(private recipe: RecipeWithIngredientName, private ingredients: Ingredient[]) {}

  async render() {
    return `
        ${await new BackLink().render()}
        <div id="${RECIPE_PAGE_ID}" class="flex flex-col place-items-center w-full pt-6">
          ${recipeHeader(this.recipe)}
          ${await new RecipeDetails(this.recipe, this.ingredients).render()}
          ${await new RecipeIngredientList(this.recipe, this.ingredients).render()}
        </div>
    `;
  }
}
