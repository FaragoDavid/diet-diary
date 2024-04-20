import { TAB_NAME, tabList } from '../components/tab-list.js';
import { DaySearch } from '../components/meals/day-search.js';
import config from '../config.js';
import { Ingredient } from '../repository/ingredient.js';
import { RecipeTab } from '../components/recipes/recipe-tab.js';

export class Dashboard implements BaseComponent {
  constructor(private ingredients: Ingredient[]) {}

  async render() {
    return `
      <div class="container p-2 mx-auto">
        <div class="flex flex-col place-items-center gap-4">
          <div class="text-center text-3xl font-medium py-2">
            ${config.texts.titles.page}
          </div>
          ${tabList(TAB_NAME.recipes, false)}
          <div id="tab-container">
            ${await new RecipeTab().render()}
          </div>
        </div>
      </div>
    `;
  }
}
// ${await new DaySearch(this.ingredients).render()}
