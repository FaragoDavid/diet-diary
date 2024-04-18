import { format } from 'date-fns';

import config from '../../config.js';
import { Ingredient } from '../../repository/ingredient.js';
import { Meal } from '../../repository/meal.js';
import { MealStats } from './meal-stats.js';

enum STATS_SPAN {
  TWO = 'col-span-2',
  FOUR = 'col-span-4',
}

export class MealComponent implements BaseComponent {
  static STATS_SPAN = STATS_SPAN;
  statsSpan: `${STATS_SPAN}`;
  isFirst: boolean;
  showDishes: boolean;

  constructor(
    private meal: Meal,
    private ingredients: Ingredient[],
    options: { statsSpan: `${STATS_SPAN}`; isFirst: boolean; showDishes: boolean },
  ) {
    this.statsSpan = options.statsSpan;
    this.isFirst = options.isFirst;
    this.showDishes = options.showDishes;
  }

  newDishAmount() {
    return `
    <div class="flex justify-center items-center">
      <input 
        type="number"
				name="amount"
        class="input input-sm input-bordered w-[4.5rem] bg-white pr-5 text-right placeholder:text-neutral peer" 
        placeholder="0"
				hx-post="/day/${format(this.meal.date, 'yyyyMMdd')}/meal/${this.meal.type}/dish"
				hx-trigger="change delay:100ms"
				hx-include="[name=${this.meal.type}-dishId]"
				hx-target="[name=${this.meal.type}-dishId]"
				hx-swap="beforebegin"
      >
        <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
      </input>
    </div>`;
  }

  newDish() {
    return `
      <select 
        name="${this.meal.type}-dishId" 
        class="select select-bordered select-sm bg-white w-28"
      >
        <option disabled selected>Válassz</option>
        ${this.ingredients
          .filter(({ id }) => !this.meal.dishes.map(({ id }) => id).includes(id))
          .map(({ id, name }) => `<option value="${id}" >${name}</option>`)
          .join('')}
      </select>
      ${this.newDishAmount()} 
      <div class="col-span-3"></div>
    `;
  }

  dishes() {
    return `
    ${this.meal.dishes.length > 0 ? `<div class="text col-span-2"></div>` : ''}
    ${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">cal</div>` : ''}
    ${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">CH</div>` : ''}
    ${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">zsír</div>` : ''}
    ${this.newDish()}
    `;
  }

  async render() {
    return `
      ${this.isFirst ? `<div id="meals" class="grid grid-cols-max-5 gap-x-2 gap-y-4">` : ''}
        <div class="text text-secondary col-span-1">${config.mealTypes.find(({ key }) => key === this.meal.type)!.name}</div>
				${await new MealStats(this.meal, this.statsSpan).render()}
				${this.showDishes ? this.dishes() : ''}
      ${this.isFirst ? `</div>` : ''}
    `;
  }
}
