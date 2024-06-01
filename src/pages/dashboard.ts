import { Ingredient } from '@prisma/client';

import { RecipeTab } from '../components/recipes/recipe-tab.js';
import { RecipeWithIngredients } from '../repository/recipe.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import config from '../config.js';

export class Dashboard implements BaseComponent {
  constructor(private recipes: RecipeWithIngredients[], private ingredients: Ingredient[]) {}

  async render() {
    return `
      <div class="container p-2 mx-auto">
        <div class="flex flex-col place-items-center gap-4">
          <div class="text-center text-3xl font-medium py-2">
            ${config.texts.titles.page}
          </div>
          ${tabList(TAB_NAME.recipes, { swapOob: false })}
          ${await new RecipeTab(this.recipes, this.ingredients).render()}
        </div>
      </div>
    `;
  }
}