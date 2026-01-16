import { Ingredient, Recipe } from '@prisma/client';

import { DayWithMealsWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import { swapOobTag } from '../../utils/swap-oob-wrapper';
import { DayMeal } from './day-meal';

export function getDayMealListId(date: Date) {
  return `day-${dateToParam(date)}-meal-list`;
}

export class DayMealList {
  constructor(
    private day: DayWithMealsWithDishes,
    private ingredients: Ingredient[],
    private recipes: Recipe[],
    private options: { layout?: 'dayList' | 'page'; swapOob?: HtmxSwapOobOption } = { layout: 'page' },
  ) {}

  async render() {
    const layout = this.options.layout || 'page';
    const gridCols = layout === 'page' ? 'grid-cols-max-3' : 'grid-cols-max-4';

    const dayMeals: string[] = [];
    for (const meal of this.day.meals) {
      dayMeals.push(await new DayMeal(meal, this.day.date, this.ingredients, this.recipes, { layout, swapOob: false }).render());
    }

    return `
      <div 
        id="${getDayMealListId(this.day.date)}" 
        class="grid ${gridCols} gap-2 px-2 items-center ${layout === 'dayList' ? 'col-span-3' : ''}"
        ${swapOobTag(this.options.swapOob)}
      >
        ${dayMeals.join('')}
      </div>
    `;
  }
}
