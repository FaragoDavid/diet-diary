import { format } from 'date-fns';

import { Ingredient } from '../../repository/ingredient.js';
import { Day } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import icons from '../../utils/icons.js';
import { DayStats } from './day-stats.js';
import { MealComponent } from './meal.js';

export class Days implements BaseComponent {
  constructor(private days: Day[], private ingredients: Ingredient[]) {}

  async day(day: Day) {
    const mealComponents: string[] = [];
    for (const meal of day.meals) {
      mealComponents.push(
        await new MealComponent({ ...meal, date: day.date }, this.ingredients, {
          statsSpan: MealComponent.STATS_SPAN.TWO,
          isFirst: false,
          showDishes: false,
        }).render(),
      );
    }

    return `
      <div class="flex items-center text-lg text-primary">${format(day.date, 'MMM. d. (EEE)')}</div>
      ${await new DayStats(day, {span: DayStats.SPAN.NONE, swap: false}).render()}
      <a href="/day/${dateToParam(day.date)}">
        <button 
          class="btn btn-primary btn-sm"
        >${icons.edit}</button>
      </a>
      ${mealComponents.join('<div class="divider divider-secondary col-span-3 m-0 pl-2"></div>')}
    `;
  }

  async render() {
    const dayComponents: string[] = [];
    for (const day of this.days) {
      dayComponents.push(await this.day(day));
    }

    return `
      <div id="meal-list" class="grid grid-cols-max-3 grid-row-flex gap-1 py-4">
        ${dayComponents.join('<div class="divider divider-primary col-span-3"></div>')}
      </div>`;
  }
}
