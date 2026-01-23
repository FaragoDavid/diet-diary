import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';

import { AmountInputOptions, amount } from '../amount';
import { texts } from '../../constants/texts';

export class IngredientDetails {
  constructor(private ingredient: Ingredient) {}

  private nutrientInput(name: string, label: string, value: number | null): string {
    const amountOptions: AmountInputOptions = {
      name,
      hx: {
        verb: 'post',
        url: `/ingredient/${this.ingredient.id}`,
      },
    };
    if (value) amountOptions.amount = value;
    return `
      <div class="text">${label}:</div>
      ${amount(amountOptions)}
    `;
  }

  calories(): string {
    return this.nutrientInput('calories', texts.nutrients.calories.long, this.ingredient.caloriesPer100);
  }

  carbs(): string {
    return this.nutrientInput('carbs', texts.nutrients.carbs.long, this.ingredient.carbsPer100);
  }

  fat(): string {
    return this.nutrientInput('fat', texts.nutrients.fat, this.ingredient.fatPer100);
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
