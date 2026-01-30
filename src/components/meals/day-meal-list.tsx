import { Ingredient } from '@prisma/client';

import { DayWithMealsWithDishes } from '../../repository/meal';
import { RecipeForSelection } from '../../repository/recipe';
import { dateToParam } from '../../utils/converters';
import { swapOobTag } from '../../utils/swap-oob-wrapper';
import { dayMeal } from './day-meal';

export function getDayMealListId(date: Date) {
  return `day-${dateToParam(date)}-meal-list`;
}

export async function dayMealList(
  day: DayWithMealsWithDishes,
  ingredients: Ingredient[],
  recipes: RecipeForSelection[],
  options: { layout?: 'dayList' | 'page'; swapOob?: HtmxSwapOobOption } = { layout: 'page' },
) {
  const layout = options.layout || 'page';
  const gridCols = layout === 'page' ? 'grid-cols-max-3' : 'grid-cols-max-4';

  const dayMeals: string[] = [];
  for (const meal of day.meals) {
    dayMeals.push(await dayMeal(meal, day.date, ingredients, recipes, { layout, swapOob: false }));
  }

  return `
    <div 
      id="${getDayMealListId(day.date)}" 
      class="grid ${gridCols} gap-2 px-2 items-center ${layout === 'dayList' ? 'col-span-3' : ''}"
      ${swapOobTag(options.swapOob)}
    >
      ${dayMeals.join('')}
    </div>
  `;
}
