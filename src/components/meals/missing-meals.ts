import { format } from 'date-fns';
import config, { MealType } from '../../config.js';
import { Day } from '../../repository/meal.js';

const ID = 'add-meals';

export function missingMealsPlaceholder() {
  return `<div id="${ID}" hx-swap-oob="true"></div>`;
}

export class MissingMeals implements BaseComponent {
  constructor(private day: Day) {}

  missingMealButton(value: MealType, name: string) {
    return `
			<button
				type="button"
				name="mealType"
				value="${value}"
				class="btn btn-sm btn-secondary"
				hx-post="/day/${format(this.day!.date, 'yyyyMMdd')}/meal"
				hx-target="#meals"
				hx-swap="beforeend"
			>
				${name}
			</button>`;
  }

  async render() {
    const missingMeals = config.mealTypes.filter(({ key }) => !this.day.meals.map(({ type }) => type).includes(key));

    return `
      <div 
				id=${ID}
				class="flex flex-wrap	items-center justify-center gap-1"
				hx-swap-oob="true"
			>
        ${missingMeals.length > 0 ? missingMeals.map(({ key, name }) => this.missingMealButton(key, name)).join('') : ''}
      </div>
      `;
  }
}
