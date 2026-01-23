import { Ingredient, Recipe } from '@prisma/client';

import { backLink } from '../components/back-link';
import { dayHeader, newDayHeader } from '../components/meals/day-header';
import { dayMealList } from '../components/meals/day-meal-list';
import { dayMeal } from '../components/meals/day-meal';
import { dayStats } from '../components/meals/day-stats';
import { missingMeals } from '../components/meals/missing-meals';
import { TAB_NAME } from '../components/tab-list';
import { DayWithMealsWithDishes } from '../repository/meal';
import { texts } from '../constants/texts';

export const DAY_PAGE_ID = 'day-page';

export class NewDayPage {
  async render() {
    return `
      ${await backLink(TAB_NAME.meals)}
      <div id="${DAY_PAGE_ID}" class="flex flex-col place-items-center w-full gap-4 pt-6">
        <div class="text-2xl text-primary">${texts.meals.newDay}</div>
        ${newDayHeader()}
      </div>`;
  }
}

export class DayPage {
  constructor(
    private day: DayWithMealsWithDishes,
    private ingredients: Ingredient[],
    private recipes: Recipe[],
  ) {}

  async render() {
    const meals: string[] = [];
    for (const meal of this.day.meals) {
      meals.push(await dayMeal(meal, this.day.date, this.ingredients, this.recipes, { layout: 'page', swapOob: false }));
    }

    return `
      ${await backLink(TAB_NAME.meals)}
      <div id="${DAY_PAGE_ID}" class="flex flex-col justify-center items-center gap-4 pt-6">
        ${dayHeader(this.day)}
        ${await dayStats(this.day, { layout: 'vertical', span: undefined, swapOob: false })}
        ${await missingMeals(this.day, { swapOob: false })}
        ${await dayMealList(this.day, this.ingredients, this.recipes, { layout: 'page', swapOob: false })}
      </div>`;
  }
}
