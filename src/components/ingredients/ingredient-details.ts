import { Ingredient } from '@prisma/client';

import { AmountInputOptions, amount } from '../amount';

const texts = {
  calories: 'Kalória',
  carbs: 'Szénhidrát',
  fat: 'Zsír',
  vegetable: 'Zöldség',
  carbCounted: 'számolandó',
};

export class IngredientDetails implements BaseComponent {
  constructor(private ingredient: Ingredient) {}

  calories() {
    const amountOptions: AmountInputOptions = {
      name: 'calories',
      hx: {
        verb: 'post',
        url: `/ingredient/${this.ingredient.id}`,
      },
    };
    if (this.ingredient.caloriesPer100) amountOptions.amount = this.ingredient.caloriesPer100;
    return `
      <div class="text">${texts.calories}:</div>
      ${amount(amountOptions)}
    `;
  }

  carbs() {
    const amountOptions: AmountInputOptions = {
      name: 'carbs',
      hx: {
        verb: 'post',
        url: `/ingredient/${this.ingredient.id}`,
      },
    };
    if (this.ingredient.carbsPer100) amountOptions.amount = this.ingredient.carbsPer100;
    return `
      <div class="text">${texts.carbs}:</div>
      ${amount(amountOptions)}
    `;
  }

  fat() {
    const amountOptions: AmountInputOptions = {
      name: 'fat',
      hx: {
        verb: 'post',
        url: `/ingredient/${this.ingredient.id}`,
      },
    };
    if (this.ingredient.fatPer100) amountOptions.amount = this.ingredient.fatPer100;
    return `
      <div class="text">${texts.fat}:</div>
      ${amount(amountOptions)}
    `;
  }

  vegetableCheckbox() {
    return `
      <div class="text">${texts.vegetable}:</div>
      <input
        type="checkbox"
        name="isVegetable"
        class="checkbox checkbox-sm"
        ${this.ingredient.isVegetable ? 'checked' : ''}
        hx-post="/ingredient/${this.ingredient.id}"
      />
    `;
  }

  carbCountedCheckbox() {
    return `
      <div class="text-sm pl-4">${texts.carbCounted}:</div>
      <input
        type="checkbox"
        name="isCarbCounted"
        class="checkbox checkbox-xs"
        ${this.ingredient.isCarbCounted ? 'checked' : ''}
        hx-post="/ingredient/${this.ingredient.id}"
      />
    `;
  }

  async render() {
    return `
      <div 
        id="ingredient-details"
        class="grid grid-cols-max-2 grid-row-flex gap-2 pb-4 items-center"
      >
        ${this.calories()}
        ${this.carbs()}
        ${this.carbCountedCheckbox()}
        ${this.fat()}
        ${this.vegetableCheckbox()}
      </div>
    `;
  }
}
