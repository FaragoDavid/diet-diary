import { Ingredient } from '../../repository/ingredient.js';
import { RecipeWithIngredientName } from '../../repository/recipe.js';
import { NewRecipeIngredient } from './new-recipe-ingredient.js';
import { RecipeIngredient } from './recipe-ingredient.js';

export const RECIPE_INGREDIENT_LIST_ID = 'recipe-ingredient-list';

const texts = {
  ingredientsHeader: 'Hozzávalók',
};
export class RecipeIngredientList implements BaseComponent {
  constructor(private recipe: RecipeWithIngredientName, private ingredients: Ingredient[]) {}

  async render() {
    const recipeIngredientComponents: string[] = [];
    for (const ingredient of this.recipe.ingredients) {
      recipeIngredientComponents.push(await new RecipeIngredient(ingredient, this.recipe.id, this.ingredients).render());
    }

    return `
      <div class="divider px-4" ></div>
      <div id="recipe-ingredient-list-container">
        <div class="text-lg text-center pb-4">${texts.ingredientsHeader}</div>
        <div id="${RECIPE_INGREDIENT_LIST_ID}" class="grid grid-cols-max-3 grid-row-flex gap-2">
          ${recipeIngredientComponents.join('<div class="divider col-span-3 my-0" ></div>')}
        </div>
        ${await new NewRecipeIngredient(this.recipe, this.ingredients, { swap: false}).render()}
      </div>
    `;
  }
}
