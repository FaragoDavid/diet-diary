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

export async function newDish(
  meal: MealWithDishes,
  date: Date,
  ingredients: Ingredient[],
  recipes: Recipe[],
  options: { swapOob?: HtmxSwapOobOption } = {},
) {
  const newDishSelectId = getMealNewDishSelectId(date, meal.type);
  const newDishAmountId = getMealNewDishAmountId(date, meal.type);

  const getSelectOptions = () => {
    const unusedIngredients = ingredients.filter(({ id }) => !meal.dishes.map(({ ingredientId }) => ingredientId).includes(id));
    const unusedRecipes = recipes.filter(({ id }) => !meal.dishes.map(({ recipeId }) => recipeId).includes(id));
    const options = [...unusedIngredients, ...unusedRecipes].sort((a, b) => a.name.localeCompare(b.name, ['hu']));

    return `
      <option disabled selected>${texts.common.emptyOption}</option>
      ${options.map(({ id, name }) => `<option value="${id}">${name}</option>`).join('')}
    `;
  };

  const dishSelector = () => {
    const template = `
      <select 
        id="${newDishSelectId}" 
        name="${meal.type}-dishId" 
        class="select select-bordered select-sm w-30" 
        ${swapOobTag(options.swapOob)} 
      >
        ${getSelectOptions()}
      </select>
    `;

    if (options.swapOob && options.swapOob !== HTMX_SWAP.ReplaceElement) return swapOobWrapper(newDishSelectId, options.swapOob, template);
    return template;
  };

  const amount = () => {
    return amountInput({
      id: `${newDishAmountId}`,
      name: `amount`,
      hx: {
        verb: 'post',
        url: `/day/${dateToParam(date)}/meal/${meal.type}/dish`,
        include: `[name=${meal.type}-dishId]`,
        target: `#${newDishAmountId}`,
        swap: HTMX_SWAP.ReplaceElement,
        trigger: 'change delay:100ms',
      },
    });
  };

  return `
    ${dishSelector()}
    ${amount()}
  `;
}
