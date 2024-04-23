import { Day } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import { stats } from '../stats.js';

enum SPAN {
  NONE = '',
  FIVE = 'col-span-5',
}

export class DayStats implements BaseComponent {
  static SPAN = SPAN;
  span: string;
  swap: boolean;

  constructor(private day: Day, options: { span: `${SPAN}`; swap: boolean }) {
    this.span = options.span;
    this.swap = options.swap;
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
        layout: 'vertical',
        size: 'sm',
        span: this.span,
        swap: this.swap,
      },
    );
  }
}
