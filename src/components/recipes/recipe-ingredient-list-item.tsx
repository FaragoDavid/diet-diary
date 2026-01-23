import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';

import icons from '../../utils/icons';
import { amount as amountInput } from '../amount';
import { stats } from '../stats';
import { recipeIngredientDivider } from './recipe-ingredient-list';

export async function recipeIngredientListItem(
  amount: number,
  ingredient: Ingredient,
  recipeId: string,
  options: { isFirst?: boolean } = {},
) {
  const ingredientCals = ((ingredient.caloriesPer100 || 0) / 100) * amount;
  const ingredientCarbs = ((ingredient.carbsPer100 || 0) / 100) * amount;
  const ingredientFat = ((ingredient.fatPer100 || 0) / 100) * amount;

  const ingredientName = () => {
    return `
      <div class="flex justify-center">
        <input 
          type="text" 
          name="${ingredient.id}" 
          class="input input-bordered input-sm max-w-32 sm:max-w-full disabled:text-neutral"
          readonly disabled
          value="${ingredient.name}"
          placeholder="Alapanyag neve"
        />
      </div>
    `;
  };

  const deleteIngredient = () => {
    return `
      <div class="flex justify-center items-center row-span-2">
        <button 
          type="button"
          class="btn btn-primary btn-sm"
          hx-delete="/recipe/${recipeId}/ingredient/${ingredient.id}"
          hx-target="this"
          hx-swap="outerHTML"
        >${icons.delete}</button>
      </div>
    `;
  };

  const amountHtml = amountInput({
    amount: amount,
    name: 'amount',
    hx: { verb: 'post', url: `/recipe/${recipeId}/ingredient/${ingredient.id}` },
  });

  const statsHtml = stats(
    { cal: ingredientCals, carbs: ingredientCarbs, fat: ingredientFat },
    { id: `ingredient-${ingredient.id}-stats`, layout: 'horizontal', size: 'sm', span: 'col-span-2' },
  );

  return `
    ${!options.isFirst ? recipeIngredientDivider : ''}
    ${ingredientName()}
    ${amountHtml}
    ${deleteIngredient()}
    ${statsHtml}
  `;
}
