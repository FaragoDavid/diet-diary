import { Ingredient } from '@prisma/client';

import { MealTab } from '../components/meals/meal-tab.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import config from '../config.js';
import { DayMealsWithDishes } from '../repository/meal.js';

export class Dashboard implements BaseComponent {
  constructor(private ingredients: Ingredient[], private days: DayMealsWithDishes[]) {}

  async render() {
    return `
      <div class="container p-2 mx-auto">
        <div class="flex flex-col place-items-center gap-4">
          <div class="text-center text-3xl font-medium py-2">
            ${config.texts.titles.page}
          </div>
          ${tabList(TAB_NAME.meals, { swapOob: false })}
          ${await new MealTab(this.days, this.ingredients).render()}
        </div>
      </div>
    `;
  }
}