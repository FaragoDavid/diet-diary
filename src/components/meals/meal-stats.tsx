import { MealWithDishes } from '../../repository/meal';
import { StatLayout, stats } from '../stats';

export async function mealStats(
  meal: MealWithDishes,
  options: { layout: StatLayout; span?: string; swapOob?: HtmxSwapOobOption } = { layout: 'horizontal' },
) {
  const { mealCals, mealCH, mealFat } = meal.dishes.reduce(
    (acc, dish) => ({
      mealCals: acc.mealCals + dish.calories,
      mealCH: acc.mealCH + dish.carbs,
      mealFat: acc.mealFat + dish.fat,
    }),
    { mealCals: 0, mealCH: 0, mealFat: 0 },
  );

  return stats(
    { cal: mealCals, carbs: mealCH, fat: mealFat },
    {
      id: `${meal.type}-stats`,
      layout: options.layout,
      span: options.span,
      size: 'sm',
      swapOob: options.swapOob,
    },
  );
}
