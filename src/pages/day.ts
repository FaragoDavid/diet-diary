
import { BackLink } from '../components/back-link.js';
import { dayHeader, newDayHeader } from '../components/meals/day-header.js';
import { DayStats } from '../components/meals/day-stats.js';
import { DayMeal } from '../components/meals/day-meal.js';
import { MissingMeals } from '../components/meals/missing-meals.js';
import { Ingredient } from '../repository/ingredient.js';
import { Day } from '../repository/meal.js';
import { DayMealList } from '../components/meals/day-meal-list.js';

export class NewDayPage implements BaseComponent {
  async render() {
    return `
      <div id="day">
        ${await new BackLink().render()}
        <div class="container py-6">
          <div id="day-container" class="flex flex-col justify-center items-center gap-4">
            ${newDayHeader()}
          </div>
        </div>
      </div>`;
  }
}

export class DayPage implements BaseComponent {
  constructor(private day: Day, private ingredients: Ingredient[]) {}

  async render() {
    const meals: string[] = [];
    for (const meal of this.day.meals) {
      meals.push(
        await new DayMeal({ ...meal, date: this.day.date }, this.ingredients, {
          mealStatLayout: 'horizontal',
          isFirst: false,
          showDishes: true,
        }).render(),
      );
    }

    return `
      <div id="day">
        ${await new BackLink().render()}
        <div class="container py-6">
          <div id="day-container" class="flex flex-col justify-center items-center gap-4">
            ${dayHeader(this.day)}
            ${await new DayStats(this.day, { layout: 'vertical', span: DayStats.SPAN.NONE, swap: false }).render()}
            ${await new MissingMeals(this.day).render()}
            ${await new DayMealList(this.day.meals, this.day.date, this.ingredients, { showDishes: true, mealStatLayout: 'horizontal', cols: 2 }).render()}
          </div>
        </div>
      </div>`;
  }
}
