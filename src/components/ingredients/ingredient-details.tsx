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

  private checkbox(name: string, label: string, checked: boolean, checkboxClass: string, labelClass: string = 'text'): string {
    const attrs: any = {
      type: 'checkbox',
      name,
      class: checkboxClass,
      'hx-post': `/ingredient/${this.ingredient.id}`,
    };
    if (checked) attrs.checked = 'checked';

    return `
      <div class="${labelClass}">${label}:</div>
      <input ${Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')} />
    `;
  }

  vegetableCheckbox(): string {
    return this.checkbox('isVegetable', texts.ingredients.vegetable, this.ingredient.isVegetable, 'checkbox checkbox-sm');
  }

  carbCountedCheckbox(): string {
    return this.checkbox(
      'isCarbCounted',
      texts.ingredients.carbCounted,
      this.ingredient.isCarbCounted,
      'checkbox checkbox-xs',
      'text-sm pl-4',
    );
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
