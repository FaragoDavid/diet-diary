import icons from '../../utils/icons.js';
import config from '../../config.js';
import { Ingredient } from '../../repository/ingredient.js';
import { Meal } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import { amount } from '../amount.js';
import { StatLayout } from '../stats.js';
import { DayMealDish } from './day-meal-dish.js';
import { MealStats } from './meal-stats.js';

enum STATS_SPAN {
  TWO = 'col-span-2',
  FOUR = 'col-span-4',
}

export class DayMeal implements BaseComponent {
  static STATS_SPAN = STATS_SPAN;
  mealStatLayout: StatLayout;
  statsSpan?: `${STATS_SPAN}`;
  isFirst: boolean;
  showDishes: boolean;

  constructor(
    private meal: Meal,
    private ingredients: Ingredient[],
    options: { mealStatLayout: StatLayout; statsSpan?: `${STATS_SPAN}`; isFirst: boolean; showDishes: boolean },
  ) {
    this.mealStatLayout = options.mealStatLayout;
    this.statsSpan = options.statsSpan;
    this.isFirst = options.isFirst;
    this.showDishes = options.showDishes;
  }

  mealName() {
    return `
      <div class="text text-secondary">${config.mealTypes.find(({ key }) => key === this.meal.type)!.name}</div>
    `;
  }

  newDish() {
    return `
      <select 
        name="${this.meal.type}-dishId" 
        class="select select-bordered select-sm max-w-30"
      >
        <option disabled selected>Válassz</option>
        ${this.ingredients
          .filter(({ id }) => !this.meal.dishes.map(({ id }) => id).includes(id))
          .map(({ id, name }) => `<option value="${id}" >${name}</option>`)
          .join('')}
      </select>
      ${amount({
        name: `amount`,
        hx: {
          verb: 'post',
          url: `/day/${dateToParam(this.meal.date)}/meal/${this.meal.type}/dish`,
          include: `[name=${this.meal.type}-dishId]`,
          target: `[name=${this.meal.type}-dishId]`,
          swap: 'beforebegin',
          trigger: 'change delay:100ms',
        },
      })}
      <div class="col-span-3"></div>
    `;
  }

  async dishes() {
    const dishComponents: string[] = [];
    for (const dish of this.meal.dishes) {
      dishComponents.push(await new DayMealDish(dish).render());
    }

    return `
      <div class="col-span-3 grid grid-cols-max-5 gap-2 px-2">
        ${this.meal.dishes.length > 0 ? `<div class="text col-span-2"></div>` : ''}
        ${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">cal</div>` : ''}
        ${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">CH</div>` : ''}
        ${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">zsír</div>` : ''}
        ${dishComponents.join('')}
        ${this.newDish()}
      </div>
    `;
  }

  deleteMeal() {
    return `
      <button 
        class="btn btn-sm"
        hx-delete="/day/${dateToParam(this.meal.date)}/meal/${this.meal.type}"
      >
        ${icons.delete}
      </button>
    `;
  }

  async render() {
    return `
      ${this.mealName()}
      ${await new MealStats(this.meal, { layout: this.mealStatLayout, swap: false }).render()}
      ${this.showDishes ? this.deleteMeal() : ''}
      ${this.showDishes ? await this.dishes() : ''}
    `;
  }
}
  