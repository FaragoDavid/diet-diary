
import { BackLink } from '../components/back-link.js';
import { dayHeader, newDayHeader } from '../components/meals/day-header.js';
import { DayStats } from '../components/meals/day-stats.js';
import { DayMeal } from '../components/meals/day-meal.js';
import { MissingMeals } from '../components/meals/missing-meals.js';
import { Ingredient } from '../repository/ingredient.js';
import { Day } from '../repository/meal.js';
import { DayMealList } from '../components/meals/day-meal-list.js';

export const DAY_PAGE_ID = 'day-page';
const texts = {
  newDay: 'Új Nap',
};

export class NewDayPage implements BaseComponent {
  async render() {
    return `
      ${await new BackLink().render()}
      <div id="${DAY_PAGE_ID}" class="flex flex-col place-items-center w-full gap-4 pt-6">
        <div class="text-2xl text-primary">${texts.newDay}</div>
        ${newDayHeader()}
      </div>`;
  }
}

export class DayPage implements BaseComponent {
  constructor(private day: Day, private ingredients: Ingredient[]) {}

  async render() {
    const meals: string[] = [];
    for (const meal of this.day.meals) {
      meals.push(await new DayMeal({ ...meal, date: this.day.date }, this.ingredients, { layout: 'page', swapOob: false }).render());
    }

    return `
      ${await new BackLink().render()}
      <div id="${DAY_PAGE_ID}" class="flex flex-col justify-center items-center gap-4 pt-6">
        ${dayHeader(this.day)}
        ${await new DayStats(this.day, { layout: 'vertical', span: DayStats.SPAN.NONE, swapOob: false }).render()}
        ${await new MissingMeals(this.day, { swapOob: false }).render()}
        ${await new DayMealList(this.day.meals, this.day.date, this.ingredients, { layout: 'page', swapOob: false }).render()}
      </div>`;
  }
}
