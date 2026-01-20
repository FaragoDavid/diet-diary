import { Ingredient, Recipe } from '@prisma/client';

import { MealWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import { swapOobTag, swapOobWrapper } from '../../utils/swap-oob-wrapper';
import { amount as amountInput } from '../amount';
import { texts } from '../../constants/texts';

export function getMealNewDishSelectId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-new-dish-select`;
}
function getMealNewDishAmountId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-new-dish-amount`;
}

export class NewDish {
  newDishSelectId: string;
  newDishAmountId: string;
  constructor(
    private meal: MealWithDishes,
    private date: Date,
    private ingredients: Ingredient[],
    private recipes: Recipe[],
    private options: { swapOob?: HtmxSwapOobOption } = {},
  ) {
    this.newDishSelectId = getMealNewDishSelectId(this.date, this.meal.type);
    this.newDishAmountId = getMealNewDishAmountId(this.date, this.meal.type);
  }

  getSelectOptions() {
    const unusedIngredients = this.ingredients.filter(({ id }) => !this.meal.dishes.map(({ ingredientId }) => ingredientId).includes(id));
    const unusedRecipes = this.recipes.filter(({ id }) => !this.meal.dishes.map(({ recipeId }) => recipeId).includes(id));
    const options = [...unusedIngredients, ...unusedRecipes].sort((a, b) => a.name.localeCompare(b.name, ['hu']));

    return `
      <option disabled selected>${texts.common.emptyOption}</option>
      ${options.map(({ id, name }) => `<option value="${id}">${name}</option>`).join('')}
    `;
  }

  dishSelector() {
    const template = `
      <select 
        id="${this.newDishSelectId}" 
        name="${this.meal.type}-dishId" 
        class="select select-bordered select-sm w-30" 
        ${swapOobTag(this.options.swapOob)} 
      >
        ${this.getSelectOptions()}
      </select>
    `;

    if (this.options.swapOob && this.options.swapOob !== HTMX_SWAP.ReplaceElement)
      return swapOobWrapper(this.newDishSelectId, this.options.swapOob, template);
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
