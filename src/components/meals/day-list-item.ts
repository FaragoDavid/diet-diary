import { Ingredient, Recipe } from '@prisma/client';
import { format } from 'date-fns';

import { DayWithMealsWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import icons from '../../utils/icons';
import { DayMealList } from './day-meal-list';
import { DayStats } from './day-stats';

export class DayListItem implements BaseComponent {
  constructor(private day: DayWithMealsWithDishes, private ingredients: Ingredient[], private recipes: Recipe[]) {}

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
      ${await new DayStats(this.day, { layout: 'vertical', swapOob: false }).render()}
      ${this.editDay()}
      ${await new DayMealList(this.day, this.ingredients, this.recipes, {
        layout: 'dayList',
        swapOob: false,
      }).render()}
    `;
  }
}
