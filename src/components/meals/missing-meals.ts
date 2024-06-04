import config, { MealType } from '../../config.js';
import { DayMealsWithDishes } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import { swapOobTag } from '../../utils/swap-oob-wrapper.js';

const MISSING_MEALS_ID = 'missing-meals';

export class MissingMeals implements BaseComponent {
  swapOob: HtmxSwapOobOption;
  constructor(private day: DayMealsWithDishes, options: { swapOob: HtmxSwapOobOption }) {
    this.swapOob = options.swapOob;
  }

  missingMealButton(value: MealType, name: string) {
    return `
			<button
				type="button"
				name="mealType"
				value="${value}"
				class="btn btn-sm btn-primary"
				hx-post="/day/${dateToParam(this.day.date)}/meal"
				hx-target="#${MISSING_MEALS_ID}"
			>
				${name}
			</button>`;
  }

  async render() {
    const missingMeals = config.mealTypes.filter(({ key }) => !this.day.meals.map(({ type }) => type).includes(key));

    return `
      <div 
				id=${MISSING_MEALS_ID}
				class="flex flex-wrap	items-center justify-center gap-1"
				${swapOobTag(this.swapOob)}
			>
        ${missingMeals.length > 0 ? missingMeals.map(({ key, name }) => this.missingMealButton(key, name)).join('') : ''}
      </div>
      `;
  }
}
