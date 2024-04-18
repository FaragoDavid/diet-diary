import config, { MealType } from '../../config.js';
import { Meal } from '../../repository/meal.js';
import ingredientRepo, { Ingredient } from '../../repository/ingredient.js';
import { MealStats } from './meal-stats.js';

export class MealComponent implements BaseComponent {
  private ingredients: Ingredient[];
  constructor(private date: string, private meal: Omit<Meal, 'date'>) {
    this.ingredients = [];
  }

  newDishAmount() {
    return `
    <div class="flex justify-center items-center">
      <input 
        type="number"
				name="amount"
        class="input input-sm input-bordered w-[4.5rem] bg-white pr-5 text-right placeholder:text-neutral peer" 
        placeholder="0"
				hx-post="/day/${this.date}/meal/${this.meal.type}/dish"
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
					.map(({ id, name }) => `<option value="${id}" >${name}</option>`).join('')}
      </select>
      ${this.newDishAmount()} 
      <div class="col-span-3"></div>
    `;
  }

  async render() {
    this.ingredients = await ingredientRepo.fetchIngredients();

    return `
        <div class="text text-secondary col-span-1">${config.mealTypes.find(({ key }) => key === this.meal.type)!.name}</div>
				${await new MealStats(this.meal).render()}
				${this.meal.dishes.length > 0 ? `<div class="text col-span-2"></div>` : ''}
				${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">cal</div>` : ''}
				${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">CH</div>` : ''}
				${this.meal.dishes.length > 0 ? `<div class="text-sm text-center italic">zsír</div>` : ''}
				${this.newDish()}
    `;
  }
}
