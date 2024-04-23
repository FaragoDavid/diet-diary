import { Ingredient } from '../../repository/ingredient.js';
import { RecipeWithIngredientName } from '../../repository/recipe.js';
import { NewRecipeIngredient } from './new-recipe-ingredient.js';
import { RecipeIngredient } from './recipe-ingredient.js';

export const RECIPE_INGREDIENT_LIST_ID = 'recipe-ingredient-list';
export const recipeIngredientDivider = '<div class="divider col-span-3 my-0 divider-secondary" ></div>';

const texts = {
  ingredientsHeader: 'Hozzávalók',
};
type Layout = 'list' | 'container';
export class RecipeIngredientList implements BaseComponent {
  layout: Layout;
  swap: boolean;
  constructor(private recipe: RecipeWithIngredientName, private ingredients: Ingredient[], options: { layout: Layout; swap: boolean }) {
    this.layout = options.layout;
    this.swap = options.swap;
  }

  async renderList() {
    const recipeIngredientComponents: string[] = [];
    for (let ingrIndex = 0; ingrIndex < this.recipe.ingredients.length; ingrIndex++) {
      const ingredient = this.recipe.ingredients[ingrIndex]!;
      recipeIngredientComponents.push(
        await new RecipeIngredient(ingredient, this.recipe.id, this.ingredients, { isFirst: ingrIndex === 0 }).render(),
      );
    }

    return `
      <div 
        id="${RECIPE_INGREDIENT_LIST_ID}" 
        class="grid grid-cols-max-3 grid-row-flex gap-2 pb-4"
        ${this.swap ? 'hx-swap-oob="true"' : ''}
      >
        ${recipeIngredientComponents.join('')}
      </div>
    `;
  }

  async renderContainer() {
    return `
      <div class="divider px-4" ></div>
      <div id="recipe-ingredient-list-container">
        <div class="text-lg text-center pb-4">${texts.ingredientsHeader}</div>
        ${await this.renderList()}
        ${await new NewRecipeIngredient(this.recipe, this.ingredients, { swap: false }).render()}
      </div>
    `;
  }

  async render() {
    switch (this.layout) {
      case 'list':
        return this.renderList();
      case 'container':
        return this.renderContainer();
    }
  }
}
