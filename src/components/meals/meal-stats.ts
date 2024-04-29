import { Meal } from "../../repository/meal.js";
import { StatLayout, stats } from '../stats.js';

export class MealStats implements BaseComponent {
  layout: StatLayout;
  span?: string;
  swap: boolean;
  constructor(private meal: Omit<Meal, 'date'>, options: { layout: StatLayout, span?: string, swap: boolean }) {
    this.layout = options.layout;
    this.span = options.span;
    this.swap = options.swap;
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
        swap: this.swap,
      },
    );
  }
}