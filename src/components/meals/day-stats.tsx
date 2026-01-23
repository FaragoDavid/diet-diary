import { DayWithMealsWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import { StatLayout, stats } from '../stats';

export enum SPAN {
  NONE = '',
  TWO = 'col-span-2',
  FIVE = 'col-span-5',
}

export async function dayStats(
  day: DayWithMealsWithDishes,
  options: { layout: StatLayout; span?: `${SPAN}`; swapOob?: HtmxSwapOobOption } = { layout: 'vertical' },
) {
  const { dayCals, dayCarbs, dayFat } = day.meals.reduce(
    (acc, meal) =>
      meal.dishes.reduce(
        ({ dayCals, dayCarbs, dayFat }, dish) => ({
          dayCals: dayCals + dish.calories,
          dayCarbs: dayCarbs + dish.carbs,
          dayFat: dayFat + dish.fat,
        }),
        acc,
      ),
    { dayCals: 0, dayCarbs: 0, dayFat: 0 },
  );

  return stats(
    { cal: dayCals, carbs: dayCarbs, fat: dayFat },
    {
      id: `day-${dateToParam(day.date)}-stats`,
      layout: options.layout,
      size: 'sm',
      span: options.span,
      swapOob: options.swapOob,
    },
  );
}
