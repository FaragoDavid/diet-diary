import { Ingredient, Recipe } from '@prisma/client';

import { DayWithMealsWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import { swapOobTag } from '../../utils/swap-oob-wrapper';
import { DayMeal } from './day-meal';

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
    private recipes: Recipe[],
    options: { layout: 'dayList' | 'page'; swapOob: HtmxSwapOobOption },
  ) {
    this.layout = options.layout;
    this.gridCols = options.layout === 'page' ? 'grid-cols-max-3' : 'grid-cols-max-4';
    this.swapOob = options.swapOob;
  }

  async render() {
    const dayMeals: string[] = [];
    for (const meal of this.day.meals) {
      dayMeals.push(await new DayMeal(meal, this.day.date, this.ingredients, this.recipes, { layout: this.layout, swapOob: false }).render());
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
