import { Ingredient } from '@prisma/client';

import { DayWithMealsWithDishes } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import { swapOobTag } from '../../utils/swap-oob-wrapper.js';
import { DayMeal } from './day-meal.js';

export function getDayMealListId(date: Date) {
  return `day-${dateToParam(date)}-meal-list`;
}

export class DayMealList implements BaseComponent {
  gridCols: string;
  swapOob: HtmxSwapOobOption;
  layout: 'dayList' | 'page';
  constructor(
    private day: DayWithMealsWithDishes,
    private ingredients: Ingredient[],
    options: { layout: 'dayList' | 'page'; swapOob: HtmxSwapOobOption },
  ) {
    this.layout = options.layout;
    this.gridCols = options.layout === 'page' ? 'grid-cols-max-3' : 'grid-cols-max-4';
    this.swapOob = options.swapOob;
  }

  async render() {
    const dayMeals: string[] = [];
    for (const meal of this.day.meals) {
      dayMeals.push(await new DayMeal(meal, this.day.date, this.ingredients, { layout: this.layout, swapOob: false }).render());
    }

    return `
      <div 
        id="${getDayMealListId(this.day.date)}" 
        class="grid ${this.gridCols} gap-2 px-2 items-center ${this.layout === 'dayList' ? 'col-span-3' : ''}"
        ${swapOobTag(this.swapOob)}
      >
        ${dayMeals.join('')}
      </div>
    `;
  }
}
