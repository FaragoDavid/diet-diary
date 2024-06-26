import { Ingredient } from '@prisma/client';

import { DayWithMealsWithDishes } from '../../repository/meal.js';
import { DayListItem } from './day-list-item.js';

export const DAY_LIST_ID = 'day-list';

export class DayList implements BaseComponent {
  swap: boolean;
  constructor(private days: DayWithMealsWithDishes[], private ingredients: Ingredient[], options: { swap: boolean }) {
    this.swap = options.swap;
  }

  async render() {
    const dayComponents: string[] = [];
    for (const day of this.days) {
      dayComponents.push(await new DayListItem(day, this.ingredients).render());
    }

    return `
      <div 
        id="${DAY_LIST_ID}" 
        class="grid grid-cols-max-3 grid-row-flex gap-2"
        ${this.swap ? 'hx-swap-oob="true"' : ''}
      >
        ${dayComponents.join('')}
      </div>`;
  }
}
