import { Meal } from "../../repository/meal.js";
import { stats } from '../stats.js';

enum SPAN {
  TWO = 'col-span-2',
  FOUR = 'col-span-4',
}

export class MealStats implements BaseComponent {
  static SPAN = SPAN;

  constructor(private meal: Omit<Meal, 'date'>, private span: `${SPAN}`, private swap: boolean = false) {}

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
        layout: 'horizontal',
        size: 'sm',
        span: this.span,
        swap: this.swap,
      },
    );
  }
}