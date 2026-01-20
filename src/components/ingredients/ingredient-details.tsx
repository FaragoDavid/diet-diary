import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';

import { AmountInputOptions, amount } from '../amount';
import { texts } from '../../constants/texts';

export class IngredientDetails {
  constructor(private ingredient: Ingredient) {}

  calories(): string {
    const amountOptions: AmountInputOptions = {
      name: 'calories',
      hx: {
        verb: 'post',
        url: `/ingredient/${this.ingredient.id}`,
      },
    };
    if (this.ingredient.caloriesPer100) amountOptions.amount = this.ingredient.caloriesPer100;
    return `
      <div class="text">${texts.nutrients.calories.long}:</div>
      ${amount(amountOptions)}
    `;
  }

  carbs(): string {
    const amountOptions: AmountInputOptions = {
      name: 'carbs',
      hx: {
        verb: 'post',
        url: `/ingredient/${this.ingredient.id}`,
      },
    };
    if (this.ingredient.carbsPer100) amountOptions.amount = this.ingredient.carbsPer100;
    return `
      <div class="text">${texts.nutrients.carbs.long}:</div>
      ${amount(amountOptions)}
    `;
  }

  fat(): string {
    const amountOptions: AmountInputOptions = {
      name: 'fat',
      hx: {
        verb: 'post',
        url: `/ingredient/${this.ingredient.id}`,
      },
    };
    if (this.ingredient.fatPer100) amountOptions.amount = this.ingredient.fatPer100;
    return `
      <div class="text">${texts.nutrients.fat}:</div>
      ${amount(amountOptions)}
    `;
  }

  vegetableCheckbox(): string {
    const attrs: any = {
      type: 'checkbox',
      name: 'isVegetable',
      class: 'checkbox checkbox-sm',
      'hx-post': `/ingredient/${this.ingredient.id}`,
    };
    if (this.ingredient.isVegetable) attrs.checked = 'checked';

    return `
      <div class="text">${texts.ingredients.vegetable}:</div>
      <input ${Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')} />
    `;
  }

  carbCountedCheckbox(): string {
    const attrs: any = {
      type: 'checkbox',
      name: 'isCarbCounted',
      class: 'checkbox checkbox-xs',
      'hx-post': `/ingredient/${this.ingredient.id}`,
    };
    if (this.ingredient.isCarbCounted) attrs.checked = 'checked';

    return `
      <div class="text-sm pl-4">${texts.ingredients.carbCounted}:</div>
      <input ${Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')} />
    `;
  }

  async render(): Promise<string> {
    return (
      <div id="ingredient-details" class="grid grid-cols-max-2 grid-row-flex gap-2 pb-4 items-center">
        {this.calories()}
        {this.carbs()}
        {this.carbCountedCheckbox()}
        {this.fat()}
        {this.vegetableCheckbox()}
      </div>
    ) as string;
  }
}
