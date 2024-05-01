import { MealType } from "../../config.js";
import { Dish } from "../../repository/meal.js";
import { dateToParam } from "../../utils/converters.js";
import icons from "../../utils/icons.js";
import { amount as dishAmount } from '../amount.js';

const texts = {
  calories: 'Kal',
  carbs: 'CH',
  fat: 'Zsír',
};

export const dayMealDishHeader = `
  <div class="text col-span-2"></div>
  <div class="text-sm text-center italic">${texts.calories}</div>
  <div class="text-sm text-center italic">${texts.carbs}</div>
  <div class="text-sm text-center italic">${texts.fat}</div>
  <div class="text"></div>
`;

export class DayMealDish implements BaseComponent {
  constructor(private dish: Dish, private date: Date, private mealType: MealType) {}

  deleteDish() {
    return `
      <button 
        class="btn btn-sm"
        hx-delete="/day/${dateToParam(this.date)}/meal/${this.mealType}/dish/${this.dish.id}"
      >
        ${icons.delete}
      </button>
    `;
  }

  async render() {
    const { name, amount, calories, carbs, fat } = this.dish;

    return `
      <div class="text">${name}</div>
      ${dishAmount({ name, amount })}
      <div class="text text-right">${Math.floor(calories)}</div>
      <div class="text text-right">${Math.floor(carbs)}</div>
      <div class="text text-right">${Math.floor(fat)}</div>
      ${this.deleteDish()}
    `;
  }
}
