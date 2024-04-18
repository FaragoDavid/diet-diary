import { Meal } from "../../repository/meal.js";

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

    return `
      <div id="${this.meal.type}-stats" class="text ${this.span} flex" ${this.swap ? `hx-swap-oob="true"` : ''}>
        <div class="text text-sm text-secondary italic">Kal: ${Math.floor(mealCals)}</div>
        <div class="divider divider-horizontal" ></div> 
        <div class="text text-sm text-secondary italic">CH: ${Math.floor(mealCH)}</div>
        <div class="divider divider-horizontal" ></div> 
        <div class="text text-sm text-secondary italic">Zsír: ${Math.floor(mealFat)}</div>
      </div>
    `;
  }
}