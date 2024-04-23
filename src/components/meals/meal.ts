import config from '../../config.js';
import { Ingredient } from '../../repository/ingredient.js';
import { Meal } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';
import { amount } from '../amount.js';
import { DishComponent } from './dish.js';
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

  newDish() {
    return `
      <select 
        name="${this.meal.type}-dishId" 
        class="select select-bordered select-sm w-28"
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
      dishComponents.push(await new DishComponent(dish).render());
    }

    return `
    ${this.meal.dishes.length > 0 ? `<div class="text col-span-2"></div>` : ''}
    ${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">cal</div>` : ''}
    ${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">CH</div>` : ''}
    ${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">zsír</div>` : ''}
    ${dishComponents.join('')}
    ${this.newDish()}
    `;
  }

  async render() {
    return `
      ${this.isFirst ? `<div id="meals" class="grid grid-cols-max-5 gap-x-2 gap-y-4">` : ''}
        <div class="text text-secondary col-span-1">${config.mealTypes.find(({ key }) => key === this.meal.type)!.name}</div>
				${await new MealStats(this.meal, this.statsSpan).render()}
				${this.showDishes ? await this.dishes() : ''}
      ${this.isFirst ? `</div>` : ''}
    `;
  }
}
