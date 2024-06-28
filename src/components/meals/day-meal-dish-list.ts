import { Ingredient, Recipe } from '@prisma/client';

import { MealType } from '../../config';
import { MealWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import { DayMealDish, DayMealDishHeader } from './day-meal-dish';
import { NewDish } from './new-dish';

export function getDeleteMealId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-delete`;
}
export function getMealDishesId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-dishes`;
}

export class DayMealDishList implements BaseComponent {
  swapOob: HtmxSwapOobOption;

  constructor(
    private meal: MealWithDishes,
    private date: Date,
    private ingredients: Ingredient[],
    private recipes: Recipe[],
    options: { swapOob: HtmxSwapOobOption },
  ) {
    this.swapOob = options.swapOob;
  }

  async render() {
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
        ${
          this.meal.dishes.length > 0 ? await new DayMealDishHeader(this.date, this.meal.type as MealType, { swapOob: false }).render() : ''
        }
        ${dishComponents.join('')}
        ${await new NewDish(this.meal, this.date, this.ingredients, this.recipes, { swapOob: false }).render()}
      </div>
    `;
  }
}
