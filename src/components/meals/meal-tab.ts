import { subDays } from 'date-fns';

import { dateToInput } from '../../utils/converters.js';
import config from '../../config.js';
import { Ingredient } from '../../repository/ingredient.js';
import { Day, fetchDays } from '../../repository/meal.js';
import icons from '../../utils/icons.js';
import { DayList } from './day-list.js';
import { TAB_CONTAINER_ID } from '../tab-list.js';

export class MealTab implements BaseComponent {
  public title = config.texts.titles.overview;

  constructor(private days: Day[], private ingredients: Ingredient[]) {}

  dateInput(id: string, defaultValue: Date) {
    return `
      <input
        id="${id}"
        type="date"
        class="input input-sm input-bordered"
        value="${dateToInput(defaultValue)}"
        hx-get="/days"
        hx-target="#days"
        hx-trigger="change"
        hx-vals="js:{fromDate: document.getElementById('fromDate').value, toDate: document.getElementById('toDate').value}"
      />
    `;
  }

  mealSearch() {
    const fromDate = this.days.reduce((acc, day) => (day.date < acc ? day.date : acc), new Date());
    const toDate = this.days.reduce((acc, day) => (day.date > acc ? day.date : acc), new Date());

    return `
      ${this.dateInput('fromDate', fromDate)}
      <span class="text-center">-</span>
      ${this.dateInput('toDate', toDate)}
    `;
  }

  addDay() {
    return `
      <a href="/new-day">
        <button 
          class="btn btn-secondary btn-sm"
        >${icons.add}</button>
      </a>
    `;
  }

  async render() {
    return `
      <div id="${TAB_CONTAINER_ID}" class="flex flex-col justify-center items-center space-y-4">
        <div class="flex justify-center items-center space-x-2">
          ${this.mealSearch()}
          <div class="divider divider-horizontal"></div>
          ${this.addDay()}
        </div>
        ${await new DayList(this.days, this.ingredients, {swap: false}).render()}
      </div>
    `;
  }
}
