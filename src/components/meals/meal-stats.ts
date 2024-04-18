import { Meal } from "../../repository/meal.js";



export class MealStats implements BaseComponent {
  constructor(private meal: Omit<Meal, 'date'>, private swap: boolean = false) {}

  async render() {
    const { mealCals, mealCH, mealFat } = this.meal.dishes.reduce(
      (acc, dish) => ({
        mealCals: acc.mealCals + dish.calories,
        mealCH: acc.mealCH + dish.carbs,
        mealFat: acc.mealFat + dish.fat,
      }),
      { mealCals: 0, mealCH: 0, mealFat: 0 },
    );

    return `
      <div id="${this.meal.type}-stats" class="text col-span-4 flex" ${this.swap ? `hx-swap-oob="true"` : ''}>
        <div class="text text-sm text-secondary italic">Cal: ${mealCals}</div>
        <div class="divider divider-horizontal" ></div> 
        <div class="text text-sm text-secondary italic">CH: ${mealCH}</div>
        <div class="divider divider-horizontal" ></div> 
        <div class="text text-sm text-secondary italic">Zsír: ${mealFat}</div>
      </div>
    `;
  }
}