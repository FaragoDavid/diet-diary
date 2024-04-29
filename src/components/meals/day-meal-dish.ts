import { Dish } from "../../repository/meal.js";
import { amount as dishAmount } from '../amount.js';

export class DayMealDish implements BaseComponent {
  constructor(private dish: Dish) {}

  async render() {
    const { name, amount, calories, carbs, fat } = this.dish;

    return `
      <div class="text">${name}</div>
      ${dishAmount({ name, amount })}
      <div class="text text-right">${Math.floor(calories)}</div>
      <div class="text text-right">${Math.floor(carbs)}</div>
      <div class="text text-right">${Math.floor(fat)}</div>
    `;
  }
}
