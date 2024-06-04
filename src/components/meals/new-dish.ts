import { Ingredient } from '@prisma/client';

import { DayMealsWithDishes } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import { HTMX_SWAP } from '../../utils/htmx.js';
import { swapOobTag, swapOobWrapper } from '../../utils/swap-oob-wrapper.js';
import { amount as amountInput } from '../amount.js';

const texts = {
  ingredientSelectorPlaceholder: 'Válassz',
};

export function getMealNewDishSelectId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-new-dish-select`;
}
function getMealNewDishAmountId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-new-dish-amount`;
}

export class NewDish implements BaseComponent {
  swapOob: HtmxSwapOobOption;
  newDishSelectId: string;
  newDishAmountId: string;
  constructor(private meal: DayMealsWithDishes['meals'][0], private date: Date, private ingredients: Ingredient[], options: { swapOob: HtmxSwapOobOption }) {
    this.swapOob = options.swapOob;
    this.newDishSelectId = getMealNewDishSelectId(this.date, this.meal.type);
    this.newDishAmountId = getMealNewDishAmountId(this.date, this.meal.type);
  }

  options() {
    return `
      <option disabled selected>${texts.ingredientSelectorPlaceholder}</option>
      ${this.ingredients
        .filter(({ id }) => !this.meal.dishes.map(({ id }) => id).includes(id))
        .map(({ id, name }) => `<option value="${id}" >${name}</option>`)
        .join('')}
    `;
  }

  dishSelector() {
    const template = `
      <select 
        id="${this.newDishSelectId}" 
        name="${this.meal.type}-dishId" 
        class="select select-bordered select-sm w-30" 
        ${swapOobTag(this.swapOob)} 
      >
        ${this.options()}
      </select>
    `;

    if (this.swapOob && this.swapOob !== HTMX_SWAP.ReplaceElement) return swapOobWrapper(this.newDishSelectId, this.swapOob, template);
    return template;
  }

  amount() {
    return amountInput({
      id: `${this.newDishAmountId}`,
      name: `amount`,
      hx: {
        verb: 'post',
        url: `/day/${dateToParam(this.date)}/meal/${this.meal.type}/dish`,
        include: `[name=${this.meal.type}-dishId]`,
        target: `#${this.newDishAmountId}`,
        swap: HTMX_SWAP.ReplaceElement,
        trigger: 'change delay:100ms',
      },
    });
  }

  async render() {
    return `
      ${this.dishSelector()}
      ${this.amount()}
    `;
  }
}
