import { format } from 'date-fns';

import repository, { Dish, DishWithMacros, Meal, MealWithDishMacros } from '../../repository.js';

export class Days implements BaseComponent {
  constructor(private fromDate: Date, private toDate: Date) {}

  dish(dish: DishWithMacros) {
    return `
      <div class="text pl-4">${dish.name}</div>
      <div class="text pl-4">${dish.amount}</div>
      <div class="text pl-4">${dish.calories}</div>
      <div class="text pl-4">${dish.carbs}</div>
      <div class="text pl-4">${dish.fat}</div>
    `;
  }

  mealStats(dishes: DishWithMacros[]) {
    const { mealCals, mealCH, mealFat } = dishes.reduce(
      (acc, dish) => ({
        mealCals: acc.mealCals + dish.calories,
        mealCH: acc.mealCH + dish.carbs,
        mealFat: acc.mealFat + dish.fat,
      }),
      { mealCals: 0, mealCH: 0, mealFat: 0 },
    );

    return `
      <div class="text text-sm italic">Cal: ${mealCals}</div>
      <div class="divider divider-horizontal" ></div> 
      <div class="text text-sm italic">CH: ${mealCH}</div>
      <div class="divider divider-horizontal" ></div> 
      <div class="text text-sm italic">Zsír: ${mealFat}</div>
    `;
  }

  meal(type: string, dishes: DishWithMacros[]) {
    return `
      <div class="text col-span-1 pl-2">${type}</div>
      <div class="text col-span-4 flex">${this.mealStats(dishes)}</div>
      <div class="text col-span-2 pl-2"></div>
      <div class="text-sm text-center italic pl-2">cal</div>
      <div class="text-sm text-center italic pl-2">CH</div>
      <div class="text-sm text-center italic pl-2">zsír</div>
      ${dishes.map((dish) => this.dish(dish)).join('')}
    `;
  }

  day(date: Date, meals: Omit<MealWithDishMacros, 'date'>[]) {
    return `
      <div class="text-lg col-span-5">${format(date, 'MMM. d. (EEE)')}</div>
      ${meals.map(({ id, type, dishes }) => this.meal(type, dishes)).join('<div class="divider divider-base-200 col-span-5 m-0"></div>')}
    `;
  }

  async render() {
    const days = await repository.fetchDayMeals(this.fromDate, this.toDate);

    return `
      <div id="meal-list" class="grid grid-cols-max-5 grid-row-flex gap-2">
        ${days.map(({ date, meals }) => this.day(date, meals)).join('<div class="divider divider-primary col-span-5"></div>')}
      </div>`;
  }
}
