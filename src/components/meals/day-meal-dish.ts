import { Dish } from '@prisma/client';

import { MealType } from '../../config.js';
import { dateToParam } from '../../utils/converters.js';
import { HTMX_SWAP } from '../../utils/htmx.js';
import icons from '../../utils/icons.js';
import { swapOobWrapper } from '../../utils/swap-oob-wrapper.js';
import { amount as dishAmount } from '../amount.js';
import { getMealDishesId } from './day-meal.js';
import { getMealNewDishSelectId } from './new-dish.js';

const texts = {
  calories: 'Kal',
  carbs: 'CH',
  fat: 'Zsír',
};

export class DayMealDishHeader implements BaseComponent {
  swapOob: HtmxSwapOobOption;
  constructor(private date: Date, private mealType: MealType, options: { swapOob: HtmxSwapOobOption }) {
    this.swapOob = options.swapOob;
  }

  async render() {
    const template = `
      <div class="text"></div>
      <div class="text"></div>
      <div class="text text-right">${texts.calories}</div>
      <div class="text text-right">${texts.carbs}</div>
      <div class="text text-right">${texts.fat}</div>
      <div class="text"></div>
    `;

    if (this.swapOob && this.swapOob !== HTMX_SWAP.ReplaceElement)
      return swapOobWrapper(getMealDishesId(this.date, this.mealType), this.swapOob, template);
    return template;
  }
}

export class DayMealDish implements BaseComponent {
  swapOob: HtmxSwapOobOption;
  constructor(private dish: Dish, private date: Date, private mealType: MealType, options: { swapOob: HtmxSwapOobOption }) {
    this.swapOob = options.swapOob;
  }

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
    const { id, name, amount, calories, carbs, fat } = this.dish;

    const template = `
      <div class="text">${name}</div>
      ${dishAmount({
        name: 'amount',
        amount,
        hx: {
          verb: 'post',
          url: `/day/${dateToParam(this.date)}/meal/${this.mealType}/dish/${id}`,
          target: `#${getMealDishesId(this.date, this.mealType)}`,
          swap: HTMX_SWAP.ReplaceElement,
          trigger: 'change delay:100ms',
        },
      })}
      <div class="text text-right">${Math.floor(calories)}</div>
      <div class="text text-right">${Math.floor(carbs)}</div>
      <div class="text text-right">${Math.floor(fat)}</div>
      ${this.deleteDish()}
    `;

    if (this.swapOob) {
      return swapOobWrapper(getMealNewDishSelectId(this.date, this.mealType), this.swapOob, template);
    }
    return template;
  }
}
