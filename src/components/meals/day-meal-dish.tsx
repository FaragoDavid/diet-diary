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

type DishWithRecipeId = Dish & { recipeId: string | null };

export async function dayMealDishHeader(date: Date, mealType: MealType, options: { swapOob?: HtmxSwapOobOption } = {}) {
  const template = `
    <div class="text"></div>
    <div class="text"></div>
    <div class="text text-right">${texts.nutrients.calories.short}</div>
    <div class="text text-right">${texts.nutrients.carbs.short}</div>
    <div class="text text-right">${texts.nutrients.fat}</div>
    <div class="text"></div>
  `;

  if (options.swapOob && options.swapOob !== HTMX_SWAP.ReplaceElement)
    return swapOobWrapper(getMealDishesId(date, mealType), options.swapOob, template);
  return template;
}

export async function dayMealDish(dish: DishWithRecipeId, date: Date, mealType: MealType, options: { swapOob?: HtmxSwapOobOption } = {}) {
  const deleteDish = () => {
    return `
      <button 
        class="btn btn-sm"
        hx-delete="/day/${dateToParam(date)}/meal/${mealType}/dish/${dish.id}"
      >
        ${icons.delete}
      </button>
    `;
  };

  const saveAsVersion = () => {
    if (!dish.recipeId) return '';
    return `
      <button 
        class="btn btn-sm btn-secondary"
        hx-post="/day/${dateToParam(date)}/meal/${mealType}/dish/${dish.id}/version"
        title="Save as cooking version"
      >
        ${icons.copy}
      </button>
    `;
  };

  const { id, name, amount, calories, carbs, fat } = dish;

  const template = `
    <div class="text">${name}</div>
    ${dishAmount({
      name: 'amount',
      amount,
      hx: {
        verb: 'post',
        url: `/day/${dateToParam(date)}/meal/${mealType}/dish/${id}`,
        target: `#${getMealDishesId(date, mealType)}`,
        swap: HTMX_SWAP.ReplaceElement,
        trigger: 'change delay:100ms',
      },
    })}
    <div class="text text-right">${Math.floor(calories)}</div>
    <div class="text text-right">${Math.floor(carbs)}</div>
    <div class="text text-right">${Math.floor(fat)}</div>
    <div class="flex gap-1">
      ${saveAsVersion()}
      ${deleteDish()}
    </div>
  `;

  if (options.swapOob) {
    return swapOobWrapper(getMealNewDishSelectId(date, mealType), options.swapOob, template);
  }
  return template;
}
