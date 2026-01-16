import { DayWithMealsWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import { StatLayout, stats } from '../stats';

enum SPAN {
  NONE = '',
  TWO = 'col-span-2',
  FIVE = 'col-span-5',
}

export class DayStats {
  static SPAN = SPAN;
  constructor(
    private day: DayWithMealsWithDishes,
    private options: { layout: StatLayout; span?: `${SPAN}`; swapOob?: HtmxSwapOobOption } = { layout: 'vertical' },
  ) {}

  async render() {
    const { dayCals, dayCarbs, dayFat } = this.day.meals.reduce(
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
        id: `day-${dateToParam(this.day.date)}-stats`,
        layout: this.options.layout,
        size: 'sm',
        span: this.options.span,
        swapOob: this.options.swapOob,
      },
    );
  }
}
