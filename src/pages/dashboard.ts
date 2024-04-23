import { IngredientTab } from '../components/ingredients/ingredient-tab.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import config from '../config.js';
import { Ingredient } from '../repository/ingredient.js';
import { RecipeWithIngredientName } from '../repository/recipe.js';

export class Dashboard implements BaseComponent {
  constructor(private recipes: RecipeWithIngredientName[], private ingredients: Ingredient[]) {}

  async render() {
    return `
      <div class="container p-2 mx-auto">
        <div class="flex flex-col place-items-center gap-4">
          <div class="text-center text-3xl font-medium py-2">
            ${config.texts.titles.page}
          </div>
          ${tabList(TAB_NAME.ingredients, false)}
          <div id="tab-container">
            ${await new IngredientTab(this.ingredients).render()}
          </div>
        </div>
      </div>
    `;
  }
}