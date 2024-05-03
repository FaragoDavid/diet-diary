import config from '../../config.js';
import { Ingredient } from '../../repository/ingredient.js';
import { Meal } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import icons from '../../utils/icons.js';
import { StatLayout } from '../stats.js';
import { DayMealDish, dayMealDishHeader } from './day-meal-dish.js';
import { MealStats } from './meal-stats.js';
import { NewDish } from './new-dish.js';

enum STATS_SPAN {
  TWO = 'col-span-2',
  FOUR = 'col-span-4',
}

export class DayMeal implements BaseComponent {
  static STATS_SPAN = STATS_SPAN;
  mealStatLayout: StatLayout;
  statsSpan?: `${STATS_SPAN}`;
  showDishes: boolean;
  swap: boolean;

  constructor(
    private meal: Meal,
    private ingredients: Ingredient[],
    options: { mealStatLayout: StatLayout; statsSpan?: `${STATS_SPAN}`; showDishes: boolean; swap: boolean },
  ) {
    this.mealStatLayout = options.mealStatLayout;
    this.statsSpan = options.statsSpan;
    this.showDishes = options.showDishes;
    this.swap = options.swap;
  }

  mealName() {
    return `
      <div class="text text-secondary">${config.mealTypes.find(({ key }) => key === this.meal.type)!.name}</div>
    `;
  }

  async dishes() {
    const dishComponents: string[] = [];
    for (const dish of this.meal.dishes) {
      dishComponents.push(await new DayMealDish(dish, this.meal.date, this.meal.type, { swapOob: false }).render());
    }

    return `
      <div
       id="day-${dateToParam(this.meal.date)}-${this.meal.type}-dishes"
       class="col-span-3 grid grid-cols-max-6 gap-2 items-center px-2"
       ${this.swap ? 'hx-swap-oob="true"' : ''}
      >
        ${this.meal.dishes.length > 0 ? dayMealDishHeader : ''}
        ${dishComponents.join('')}
        ${await new NewDish(this.meal, this.ingredients, { swapOob: false }).render()}
      </div>
    `;
  }

  deleteMeal() {
    return `
      <button 
        class="btn btn-sm btn-secondary p-0"
        hx-delete="/day/${dateToParam(this.meal.date)}/meal/${this.meal.type}"
      >
        ${icons.delete}
      </button>
    `;
  }

  async render() {
    return `
      ${this.mealName()}
      ${await new MealStats(this.meal, { layout: this.mealStatLayout, swap: false }).render()}
      ${this.showDishes ? this.deleteMeal() : ''}
      ${this.showDishes ? await this.dishes() : ''}
    `;
  }
}
  