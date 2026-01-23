import config, { MealType } from '../../config';
import { DayWithMealsWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import { swapOobTag } from '../../utils/swap-oob-wrapper';

const MISSING_MEALS_ID = 'missing-meals';

export async function missingMeals(day: DayWithMealsWithDishes, options: { swapOob?: HtmxSwapOobOption } = {}) {
  const missingMealButton = (value: MealType, name: string) => {
    return `
      <button
        type="button"
        name="mealType"
        value="${value}"
        class="btn btn-sm btn-primary"
        hx-post="/day/${dateToParam(day.date)}/meal"
        hx-target="#${MISSING_MEALS_ID}"
      >
        ${name}
      </button>`;
  };

  const missingMeals = config.mealTypes.filter(({ key }) => !day.meals.map(({ type }) => type).includes(key));

  return `
    <div 
      id="${MISSING_MEALS_ID}"
      class="flex flex-wrap items-center justify-center gap-1"
      ${swapOobTag(options.swapOob)}
    >
      ${missingMeals.length > 0 ? missingMeals.map(({ key, name }) => missingMealButton(key, name)).join('') : ''}
    </div>
  `;
}
