import { Ingredient } from '@prisma/client';

import { IngredientTab } from '../components/ingredients/ingredient-tab.js';
import { MealTab } from '../components/meals/meal-tab.js';
import { RecipeTab } from '../components/recipes/recipe-tab.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import config from '../config.js';
import { DayWithMealsWithDishes } from '../repository/meal.js';
import { RecipeWithIngredients } from '../repository/recipe.js';

export class Dashboard implements BaseComponent {
  constructor(
    private target: `${TAB_NAME}`,
    private ingredients: Ingredient[],
    private recipes: RecipeWithIngredients[],
    private days: DayWithMealsWithDishes[],
  ) {}

  async activeTab() {
    switch (this.target) {
      case TAB_NAME.ingredients:
        return await new IngredientTab(this.ingredients).render();
      case TAB_NAME.recipes:
        return await new RecipeTab(this.recipes, this.ingredients).render();
      default:
        return await new MealTab(this.days, this.ingredients, this.recipes).render();
    }
  }

  async render() {
    return `
      <div class="container p-2 mx-auto">
        <div class="flex flex-col place-items-center gap-4">
          <div class="text-center text-3xl font-medium py-2">
            ${config.texts.titles.page}
          </div>
          ${tabList(this.target, { swapOob: false })}
          ${await this.activeTab()}
        </div>
      </div>
    `;
  }
}