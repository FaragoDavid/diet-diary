import { Meal } from '../../repository/meal.js';
import { DayMeal } from './day-meal.js';
import { Ingredient } from '../../repository/ingredient.js';
import { dateToParam } from '../../utils/converters.js';
import { StatLayout } from '../stats.js';

export class DayMealList implements BaseComponent {
  showDishes: boolean;
  mealStatLayout: StatLayout;
  gridCols: string;
  constructor(private meals: Omit<Meal, 'date'>[], private date: Date, private ingredients: Ingredient[], options: {showDishes: boolean, mealStatLayout: StatLayout, cols: 2 | 4}) {
    this.showDishes = options.showDishes;
    this.mealStatLayout = options.mealStatLayout;
    this.gridCols = `grid-cols-${options.cols === 2 ? 'max-2' : '4'}`;
  }

  async render() {
    const dayMeals: string[] = [];
    for (const meal of this.meals) {
      dayMeals.push(
        await new DayMeal({ ...meal, date: this.date }, this.ingredients, {
          mealStatLayout: this.mealStatLayout,
          isFirst: false,
          showDishes: this.showDishes,
        }).render(),
      );
    }

    return `
      <div id="day-${dateToParam(this.date)}-meal-list" class="col-span-3 grid ${this.gridCols} gap-2 px-2">
        ${dayMeals.join('')}
      </div>
    `;
  }
}
