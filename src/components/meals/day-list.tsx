import { Ingredient, Recipe } from '@prisma/client';

import { DayWithMealsWithDishes } from '../../repository/meal';
import { dayListItem } from './day-list-item';

export const DAY_LIST_ID = 'day-list';

export async function dayList(
  days: DayWithMealsWithDishes[],
  ingredients: Ingredient[],
  recipes: Recipe[],
  options: { swap?: boolean } = {},
) {
  const dayComponents: string[] = [];
  for (const day of days) {
    dayComponents.push(await dayListItem(day, ingredients, recipes));
  }

  return `
    <div 
      id="${DAY_LIST_ID}" 
      class="grid grid-cols-max-3 grid-row-flex gap-2"
      ${options.swap ? 'hx-swap-oob="true"' : ''}
    >
      ${dayComponents.join('')}
    </div>`;
}
