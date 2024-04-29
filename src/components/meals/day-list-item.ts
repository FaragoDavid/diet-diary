import { format } from 'date-fns';
import { Ingredient } from '../../repository/ingredient.js';
import { Day } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import icons from '../../utils/icons.js';
import { DayStats } from './day-stats.js';
import { DayMeal } from './day-meal.js';

export class DayListItem implements BaseComponent {
  constructor(private day: Day, private ingredients: Ingredient[]) {}

  async render() {
    const dayMeals: string[] = [];
    for (const meal of this.day.meals) {
      dayMeals.push(
        await new DayMeal({ ...meal, date: this.day.date }, this.ingredients, {
          statsSpan: DayMeal.STATS_SPAN.TWO,
          isFirst: false,
          showDishes: false,
        }).render(),
      );
    }

    return `
      <div class="flex items-center text-lg text-primary">${format(this.day.date, 'MMM. d. (EEE)')}</div>
      ${await new DayStats(this.day, { span: DayStats.SPAN.TWO, swap: false }).render()}
      <a href="/day/${dateToParam(this.day.date)}">
        <button 
          class="btn btn-primary btn-sm"
        >${icons.edit}</button>
      </a>
      ${dayMeals.join('<div class="divider divider-secondary col-span-4 m-0 pl-2"></div>')}
    `;
  }
}
