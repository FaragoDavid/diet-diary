import { Meal } from '../../repository/meal.js';
import { DayMeal } from './day-meal.js';
import { Ingredient } from '../../repository/ingredient.js';
import { dateToParam } from '../../utils/converters.js';
import { StatLayout } from '../stats.js';


export function getDayMealListId(date: Date) {
  return `day-${dateToParam(date)}-meal-list`;
}

export class DayMealList implements BaseComponent {
  showDishes: boolean;
  mealStatLayout: StatLayout;
  gridCols: string;
  swap: boolean;
  constructor(
    private meals: Omit<Meal, 'date'>[],
    private date: Date,
    private ingredients: Ingredient[],
    options: { showDishes: boolean; mealStatLayout: StatLayout; cols: 3 | 4; swap: boolean },
  ) {
    this.showDishes = options.showDishes;
    this.mealStatLayout = options.mealStatLayout;
    this.gridCols = `grid-cols-${options.cols === 3 ? 'max-3' : '4'}`;
    this.swap = options.swap;
  }

  async render() {
    const dayMeals: string[] = [];
    for (const meal of this.meals) {
      dayMeals.push(
        await new DayMeal({ ...meal, date: this.date }, this.ingredients, {
          mealStatLayout: this.mealStatLayout,
          showDishes: this.showDishes,
          swap: false,
        }).render(),
      );
    }

    return `
      <div 
        id="${getDayMealListId(this.date)}" 
        class="grid ${this.gridCols} gap-2 px-2 items-center ${this.showDishes ? '' : 'col-span-3'}"
        ${this.swap ? 'hx-swap-oob="true"' : ''}
      >
        ${dayMeals.join('')}
      </div>
    `;
  }
}
