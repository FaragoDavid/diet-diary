import { MealWithDishes } from '../../repository/meal';
import { StatLayout, stats } from '../stats';

export class MealStats implements BaseComponent {
  layout: StatLayout;
  span?: string;
  swapOob: HtmxSwapOobOption;
  constructor(private meal: MealWithDishes, options: { layout: StatLayout; span?: string; swapOob: HtmxSwapOobOption }) {
    this.layout = options.layout;
    this.span = options.span;
    this.swapOob = options.swapOob;
  }

  async render() {
    const { mealCals, mealCH, mealFat } = this.meal.dishes.reduce(
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
        id: `${this.meal.type}-stats`,
        layout: this.layout,
        span: this.span,
        size: 'sm',
        swapOob: this.swapOob,
      },
    );
  }
}
