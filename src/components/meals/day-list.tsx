import { Ingredient, Recipe } from '@prisma/client';

import { DayWithMealsWithDishes } from '../../repository/meal';
import { DayListItem } from './day-list-item';

export const DAY_LIST_ID = 'day-list';

export class DayList {
  constructor(
    private days: DayWithMealsWithDishes[],
    private ingredients: Ingredient[],
    private recipes: Recipe[],
    private options: { swap?: boolean } = {},
  ) {}

  async render() {
    const dayComponents: string[] = [];
    for (const day of this.days) {
      dayComponents.push(await new DayListItem(day, this.ingredients, this.recipes).render());
    }

    return `
      <div 
        id="${DAY_LIST_ID}" 
        class="grid grid-cols-max-3 grid-row-flex gap-2"
        ${this.options.swap ? 'hx-swap-oob="true"' : ''}
      >
        ${dayComponents.join('')}
      </div>`;
  }
}
