
import { BackLink } from '../components/back-link.js';
import { dayHeader, newDayHeader } from '../components/meals/day-header.js';
import { DayStats } from '../components/meals/day-stats.js';
import { MealComponent } from '../components/meals/meal.js';
import { MissingMeals } from '../components/meals/missing-meals.js';
import { Ingredient } from '../repository/ingredient.js';
import { Day } from '../repository/meal.js';

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
        await new MealComponent({ ...meal, date: this.day.date }, this.ingredients, {
          statsSpan: MealComponent.STATS_SPAN.FOUR,
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
            ${await new DayStats(this.day, DayStats.SPAN.FIVE).render()}
            ${await new MissingMeals(this.day).render()}
            <div id="meals" class="grid grid-cols-max-5 gap-x-2 gap-y-4">
              ${meals.join('')}
            </div>
          </div>
        </div>
      </div>`;
  }
}
