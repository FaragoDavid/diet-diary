import config, { MealType } from '../../config';
import { DayWithMealsWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import { swapOobTag } from '../../utils/swap-oob-wrapper';

const MISSING_MEALS_ID = 'missing-meals';

export class MissingMeals {
  constructor(
    private day: DayWithMealsWithDishes,
    private options: { swapOob?: HtmxSwapOobOption } = {},
  ) {}

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
        id="${MISSING_MEALS_ID}"
        class="flex flex-wrap items-center justify-center gap-1"
        ${swapOobTag(this.options.swapOob)}
      >
        ${missingMeals.length > 0 ? missingMeals.map(({ key, name }) => this.missingMealButton(key, name)).join('') : ''}
      </div>
    `;
  }
}
