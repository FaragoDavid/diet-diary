import { DayWithMealsWithDishes } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import { StatLayout, stats } from '../stats.js';

enum SPAN {
  NONE = '',
  TWO = 'col-span-2',
  FIVE = 'col-span-5',
}

export class DayStats implements BaseComponent {
  static SPAN = SPAN;
  layout: StatLayout;
  span?: string;
  swapOob: HtmxSwapOobOption;

  constructor(private day: DayWithMealsWithDishes, options: { layout: StatLayout; span?: `${SPAN}`; swapOob: HtmxSwapOobOption }) {
    this.layout = options.layout;
    this.span = options.span;
    this.swapOob = options.swapOob;
  }

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
        layout: this.layout,
        size: 'sm',
        span: this.span,
        swapOob: this.swapOob,
      },
    );
  }
}
