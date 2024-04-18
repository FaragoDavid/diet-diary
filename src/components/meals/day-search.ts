import { subDays } from 'date-fns';

import { dateToInput } from '../../utils/converters.js';
import config from '../../config.js';
import { Ingredient } from '../../repository/ingredient.js';
import { fetchDayMeals } from '../../repository/meal.js';
import icons from '../../utils/icons.js';
import { Days } from './days.js';

const dateInput = (id: string, defaultValue: Date) => `
  <input
    id="${id}"
    type="date"
    class="border rounded px-2 py-1"
    value="${dateToInput(defaultValue)}"
    hx-get="/days"
    hx-target="#days"
    hx-trigger="change"
    hx-vals="js:{fromDate: document.getElementById('fromDate').value, toDate: document.getElementById('toDate').value}"
  />
`;

export class DaySearch implements BaseComponent {
  public title = config.texts.titles.overview;

  constructor(private ingredients: Ingredient[]) {}

  async render() {
    const fromDate = subDays(new Date(), 7);
    const toDate = new Date();
    const days = await fetchDayMeals(fromDate, toDate);

    return `
      <div class="flex justify-center items-center max-w-96">
        ${dateInput('fromDate', fromDate)}
        <span class="text-center p-1">-</span>
        ${dateInput('toDate', toDate)}
        <div class="divider divider-horizontal m-1"></div>
        <a href="/new-day">
          <button 
            class="btn btn-secondary btn-sm"
          >${icons.add}</button>
        </a>
      </div>

      <div id="days" class="flex flex-col justify-center items-center gap-6 w-full">
        ${await new Days(days, this.ingredients).render()}
      </div>
      `;
  }
}
  