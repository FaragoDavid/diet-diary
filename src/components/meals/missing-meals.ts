import config, { MealType } from '../../config.js';
import { Day } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';

const ID = 'add-meals';

export class MissingMeals implements BaseComponent {
  constructor(private day: Day, private swap = false) {}

  missingMealButton(value: MealType, name: string) {
    return `
			<button
				type="button"
				name="mealType"
				value="${value}"
				class="btn btn-sm btn-secondary"
				hx-post="/day/${dateToParam(this.day.date)}/meal"
				hx-target="${this.day.meals.length === 0 ? `#day-container` : '#meals'}"
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
				${this.swap ? 'hx-swap-oob="true"' : ''}
			>
        ${missingMeals.length > 0 ? missingMeals.map(({ key, name }) => this.missingMealButton(key, name)).join('') : ''}
      </div>
      `;
  }
}
