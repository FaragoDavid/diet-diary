import config, { MealType } from '../../config.js';
import { DAY_PAGE_ID } from '../../pages/day.js';
import { Day } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import { getDayMealListId } from './day-meal-list.js';

const ID = 'missing-meals';

export class MissingMeals implements BaseComponent {
	swap: boolean;
  constructor(private day: Day, options: { swap: boolean }) {
		this.swap = options.swap;
	}

  missingMealButton(value: MealType, name: string) {
    return `
			<button
				type="button"
				name="mealType"
				value="${value}"
				class="btn btn-sm btn-primary"
				hx-post="/day/${dateToParam(this.day.date)}/meal"
				hx-target="${this.swap ? `#${getDayMealListId(this.day.date)}` : `#${DAY_PAGE_ID}`}"
				hx-swap="${this.swap ? 'outerHTML' : 'beforeend'}"
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
				${this.swap ? 'hx-swap-oob="true"' : ''}
			>
        ${missingMeals.length > 0 ? missingMeals.map(({ key, name }) => this.missingMealButton(key, name)).join('') : ''}
      </div>
      `;
  }
}
