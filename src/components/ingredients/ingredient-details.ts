import { Ingredient } from '@prisma/client';

const texts = {
  calories: 'Kalória',
  carbs: 'Szénhidrát',
  fat: 'Zsír',
};

export class IngredientDetails implements BaseComponent {
  constructor(private ingredient: Ingredient) {}

  calories() {
    return `
      <div class="text">${texts.calories}:</div>
      <input
        type="number"
        name="calories"
        class="input input-sm input-bordered w-16 text-right placeholder:text-neutral"
        value="${this.ingredient.caloriesPer100}"
        hx-post="/ingredient/${this.ingredient.id}"
      />
    `;
  }

  carbs() {
    return `
      <div class="text">${texts.carbs}:</div>
      <input
        type="number"
        name="carbs"
        class="input input-sm input-bordered w-16 text-right placeholder:text-neutral"
        value="${this.ingredient.carbsPer100}"
        hx-post="/ingredient/${this.ingredient.id}"
      />
    `;
  }

  fat() {
    return `
      <div class="text">${texts.fat}:</div>
      <input
        type="number"
        name="fat"
        class="input input-sm input-bordered w-16 text-right placeholder:text-neutral"
        value="${this.ingredient.fatPer100}"
        hx-post="/ingredient/${this.ingredient.id}"
      />
    `;
  }

  async render() {
    return `
      <div 
        id="ingredient-details"
        class="grid grid-cols-max-2 grid-row-flex gap-2 pb-4"
      >
        ${this.calories()}
        ${this.carbs()}
        ${this.fat()}
      </div>
    `;
  }
}
