import { Ingredient, Recipe } from '@prisma/client';

import config from '../../config';
import { DayWithMealsWithDishes } from '../../repository/meal';
import { dateToInput } from '../../utils/converters';
import icons from '../../utils/icons';
import { TAB_CONTAINER_ID } from '../tab-list';
import { DAY_LIST_ID, dayList } from './day-list';

export async function mealTab(days: DayWithMealsWithDishes[], ingredients: Ingredient[], recipes: Recipe[]) {
  const dateInput = (id: string, defaultValue: Date) => {
    return `
      <input
        id="${id}"
        type="date"
        class="input input-sm input-bordered"
        hx-get="/days"
        hx-target="#${DAY_LIST_ID}"
        hx-trigger="change"
        hx-vals="js:{fromDate: document.getElementById('fromDate').value, toDate: document.getElementById('toDate').value}"
      />
    `;
  };

  const mealSearch = () => {
    const fromDate = days.reduce((acc, day) => (day.date < acc ? day.date : acc), new Date());
    const toDate = days.reduce((acc, day) => (day.date > acc ? day.date : acc), new Date());

    return `
      ${dateInput('fromDate', fromDate)}
      <span class="text-center">-</span>
      ${dateInput('toDate', toDate)}
    `;
  };

  const addDay = () => {
    return `
      <a href="/new-day">
        <button 
          id="add-day-btn"
          class="btn btn-secondary btn-sm"
        >${icons.add}</button>
      </a>
    `;
  };

  return `
    <div id="${TAB_CONTAINER_ID}" class="flex flex-col justify-center items-center space-y-4">
      <div class="flex justify-center items-center space-x-2">
        ${mealSearch()}
        <div class="divider divider-horizontal"></div>
        ${addDay()}
      </div>
      ${await dayList(days, ingredients, recipes, { swap: false })}
    </div>
  `;
}

mealTab.title = config.texts.titles.overview;
