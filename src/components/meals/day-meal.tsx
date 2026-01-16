import { Ingredient, Recipe } from '@prisma/client';

import config, { MealType } from '../../config';
import { MealWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import icons from '../../utils/icons';
import { StatLayout } from '../stats';
import { DayMealDish, DayMealDishHeader } from './day-meal-dish';
import { MealStats } from './meal-stats';
import { NewDish } from './new-dish';
import { DayMealDishList } from './day-meal-dish-list';

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

export class DayMeal {
  static STATS_SPAN = STATS_SPAN;
  constructor(
    private meal: MealWithDishes,
    private date: Date,
    private ingredients: Ingredient[],
    private recipes: Recipe[],
    private options: { layout: 'dayList' | 'page'; swapOob?: HtmxSwapOobOption } = { layout: 'page' },
  ) {}

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
      >
        ${
          this.meal.dishes.length > 0 ? await new DayMealDishHeader(this.date, this.meal.type as MealType, { swapOob: false }).render() : ''
        }
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
    const mealStatLayout: StatLayout = this.options.layout === 'page' ? 'horizontal' : 'cells';
    const showDishes = this.options.layout === 'page';

    return `
      ${this.mealName()}
      ${await new MealStats(this.meal, { layout: mealStatLayout, swapOob: false }).render()}
      ${showDishes ? this.deleteMeal() : ''}
      ${
        showDishes
          ? await new DayMealDishList(this.meal, this.date, this.ingredients, this.recipes, { swapOob: this.options.swapOob }).render()
          : ''
      }
    `;
  }
}
