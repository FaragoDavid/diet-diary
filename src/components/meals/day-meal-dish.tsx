import { Dish } from '@prisma/client';

import { MealType } from '../../config';
import { dateToParam } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import icons from '../../utils/icons';
import { swapOobWrapper } from '../../utils/swap-oob-wrapper';
import { amount as dishAmount } from '../amount';
import { getMealDishesId } from './day-meal';
import { getMealNewDishSelectId } from './new-dish';
import { texts } from '../../constants/texts';

export class DayMealDishHeader {
  constructor(
    private date: Date,
    private mealType: MealType,
    private options: { swapOob?: HtmxSwapOobOption } = {},
  ) {}

  async render() {
    const template = `
      <div class="text"></div>
      <div class="text"></div>
      <div class="text text-right">${texts.nutrients.calories.short}</div>
      <div class="text text-right">${texts.nutrients.carbs.short}</div>
      <div class="text text-right">${texts.nutrients.fat}</div>
      <div class="text"></div>
    `;

    if (this.options.swapOob && this.options.swapOob !== HTMX_SWAP.ReplaceElement)
      return swapOobWrapper(getMealDishesId(this.date, this.mealType), this.options.swapOob, template);
    return template;
  }
}

export class DayMealDish {
  constructor(
    private dish: Dish,
    private date: Date,
    private mealType: MealType,
    private options: { swapOob?: HtmxSwapOobOption } = {},
  ) {}

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

    if (this.options.swapOob) {
      return swapOobWrapper(getMealNewDishSelectId(this.date, this.mealType), this.options.swapOob, template);
    }
    return template;
  }
}
