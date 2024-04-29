import { Meal } from "../../repository/meal.js";
import { stats } from '../stats.js';

export class MealStats implements BaseComponent {
  swap: boolean;
  constructor(private meal: Omit<Meal, 'date'>, options: { swap: boolean }) {
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
        layout: 'cells',
        size: 'sm',
        swap: this.swap,
      },
    );
  }
}