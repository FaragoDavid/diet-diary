import { Ingredient, Recipe } from '@prisma/client';

import config, { MealType } from '../../config.js';
import { MealWithDishes } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import icons from '../../utils/icons.js';
import { StatLayout } from '../stats.js';
import { DayMealDish, DayMealDishHeader } from './day-meal-dish.js';
import { MealStats } from './meal-stats.js';
import { NewDish } from './new-dish.js';

enum STATS_SPAN {
  TWO = 'col-span-2',
  FOUR = 'col-span-4',
}

export function getDeleteMealId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-delete`;
}
export function getMealDishesId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-dishes`;
}

export class DayMeal implements BaseComponent {
  static STATS_SPAN = STATS_SPAN;
  mealStatLayout: StatLayout;
  showDishes: boolean;
  swapOob: HtmxSwapOobOption;
  constructor(
    private meal: MealWithDishes,
    private date: Date,
    private ingredients: Ingredient[],
    private recipes: Recipe[],
    options: { layout: 'dayList' | 'page'; swapOob: HtmxSwapOobOption },
  ) {
    this.mealStatLayout = options.layout === 'page' ? 'horizontal' : 'cells';
    this.showDishes = options.layout === 'page';
    this.swapOob = options.swapOob;
  }

  mealName() {
    return `
      <div class="text text-secondary">${config.mealTypes.find(({ key }) => key === this.meal.type)!.name}</div>
    `;
  }

  async dishes() {
    const dishComponents: string[] = [];
    for (const dish of this.meal.dishes) {
      dishComponents.push(await new DayMealDish(dish, this.date, this.meal.type as MealType, { swapOob: false }).render());
    }

    return `
      <div
       id="${getMealDishesId(this.date, this.meal.type)}"
       class="col-span-3 grid grid-cols-max-6 gap-2 items-center px-2"
       ${this.swapOob ? 'hx-swap-oob="true"' : ''}
      >
        ${this.meal.dishes.length > 0 ? await new DayMealDishHeader(this.date, this.meal.type as MealType, { swapOob: false }).render() : ''}
        ${dishComponents.join('')}
        ${await new NewDish(this.meal, this.date, this.ingredients, this.recipes, { swapOob: false }).render()}
      </div>
    `;
  }

  deleteMeal() {
    return `
      <button 
        id="${getDeleteMealId(this.date, this.meal.type)}"
        class="btn btn-sm btn-secondary p-0"
        hx-delete="/day/${dateToParam(this.date)}/meal/${this.meal.type}"
      >
        ${icons.delete}
      </button>
    `;
  }

  async render() {
    return `
      ${this.mealName()}
      ${await new MealStats(this.meal, { layout: this.mealStatLayout, swapOob: false }).render()}
      ${this.showDishes ? this.deleteMeal() : ''}
      ${this.showDishes ? await this.dishes() : ''}
    `;
  }
}
  