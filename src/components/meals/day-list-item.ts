import { format } from 'date-fns';
import { Ingredient } from '../../repository/ingredient.js';
import { Day } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import icons from '../../utils/icons.js';
import { DayMealList } from './day-meal-list.js';
import { DayStats } from './day-stats.js';

export class DayListItem implements BaseComponent {
  constructor(private day: Day, private ingredients: Ingredient[]) {}

  dayDate() {
    return `
      <div class="flex items-center text-lg text-primary">${format(this.day.date, 'MMM. d. (EEE)')}</div>
    `;
  }

  editDay() {
    return `
      <a href="/day/${dateToParam(this.day.date)}">
        <button 
          class="btn btn-primary btn-sm"
        >${icons.edit}</button>
      </a>
    `;
  }

  async render() {
    return `
      ${this.dayDate()}
      ${await new DayStats(this.day, { layout: 'vertical', swap: false }).render()}
      ${this.editDay()}
      ${await new DayMealList(this.day.meals, this.day.date, this.ingredients, {showDishes: false, mealStatLayout: 'cells', cols: 4}).render()}
    `;
  }
}
