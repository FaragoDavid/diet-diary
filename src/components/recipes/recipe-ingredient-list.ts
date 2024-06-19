import { Ingredient } from '@prisma/client';

import { RecipeWithIngredients } from '../../repository/recipe.js';
import { NewRecipeIngredient } from './new-recipe-ingredient.js';
import { RecipeIngredientListItem } from './recipe-ingredient-list-item.js';

export const RECIPE_INGREDIENT_LIST_ID = 'recipe-ingredient-list';
export const recipeIngredientDivider = '<div class="divider col-span-3 my-0 divider-secondary" ></div>';

const texts = {
  ingredientsHeader: 'Hozzávalók',
};
type Layout = 'list' | 'container';
export class RecipeIngredientList implements BaseComponent {
  layout: Layout;
  swap: boolean;
  constructor(private recipe: RecipeWithIngredients, private ingredients: Ingredient[], options: { layout: Layout; swap: boolean }) {
    this.layout = options.layout;
    this.swap = options.swap;
  }

  async renderList() {
    const recipeIngredientComponents: string[] = [];
    for (let ingrIndex = 0; ingrIndex < this.recipe.ingredients.length; ingrIndex++) {
      const {amount, ingredient} = this.recipe.ingredients[ingrIndex]!;
      recipeIngredientComponents.push(
        await new RecipeIngredientListItem(amount, ingredient, this.recipe.id, { isFirst: ingrIndex === 0 }).render(),
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
        ${await new NewRecipeIngredient(this.recipe, this.ingredients, { swapOob: false }).render()}
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
