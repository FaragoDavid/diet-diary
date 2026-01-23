import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';

import { AmountInputOptions, amount } from '../amount';
import { texts } from '../../constants/texts';

export async function ingredientDetails(ingredient: Ingredient) {
  const nutrientInput = (name: string, label: string, value: number | null) => {
    const amountOptions: AmountInputOptions = {
      name,
      hx: {
        verb: 'post',
        url: `/ingredient/${ingredient.id}`,
      },
    };
    if (value) amountOptions.amount = value;
    return `
      <div class="text">${label}:</div>
      ${amount(amountOptions)}
    `;
  };

  const calories = () => {
    return nutrientInput('calories', texts.nutrients.calories.long, ingredient.caloriesPer100);
  };

  const carbs = () => {
    return nutrientInput('carbs', texts.nutrients.carbs.long, ingredient.carbsPer100);
  };

  const fat = () => {
    return nutrientInput('fat', texts.nutrients.fat, ingredient.fatPer100);
  };

  const checkbox = (name: string, label: string, checked: boolean, checkboxClass: string, labelClass: string = 'text') => {
    const attrs: any = {
      type: 'checkbox',
      name,
      class: checkboxClass,
      'hx-post': `/ingredient/${ingredient.id}`,
    };
    if (checked) attrs.checked = 'checked';

    return `
      <div class="${labelClass}">${label}:</div>
      <input ${Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')} />
    `;
  };

  const vegetableCheckbox = () => {
    return checkbox('isVegetable', texts.ingredients.vegetable, ingredient.isVegetable, 'checkbox checkbox-sm');
  };

  const carbCountedCheckbox = () => {
    return checkbox('isCarbCounted', texts.ingredients.carbCounted, ingredient.isCarbCounted, 'checkbox checkbox-xs', 'text-sm pl-4');
  };

  return (
    <div id="ingredient-details" class="grid grid-cols-max-2 grid-row-flex gap-2 pb-4 items-center">
      {calories()}
      {carbs()}
      {carbCountedCheckbox()}
      {fat()}
      {vegetableCheckbox()}
    </div>
  ) as string;
}
