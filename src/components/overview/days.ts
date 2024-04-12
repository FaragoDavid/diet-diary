import { format } from 'date-fns';

import repository, { DishWithMacros, Ingredient, MealWithDishMacros } from '../../repository.js';
import config from '../../config.js';
import icons from '../../utils/icons.js';

export class Days implements BaseComponent {
  private ingredients?: Ingredient[];
  constructor(private fromDate: Date, private toDate: Date) {}

  dishAmount({ amount, name }: { amount?: number; name?: string }) {
    return `
    <div class="flex justify-center items-center">
      <input 
        type="number"
        ${name ? `name="${name}"` : ''}
        ${amount ? `value="${amount}"` : ''}
        class="input input-sm input-bordered w-[4.5rem] bg-white pr-5 text-right placeholder:text-neutral peer" 
        placeholder="0"
      >
        <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
      </input>
    </div>`;
  }

  dish({ name, amount, calories, carbs, fat }: DishWithMacros) {
    return `
      <div class="text pl-4">${name}</div>
      ${this.dishAmount({ amount })}
      <div class="text text-right">${calories}</div>
      <div class="text text-right">${carbs}</div>
      <div class="text text-right">${fat}</div>
    `;
  }

  newDish(date, mealId) {
    const name = `newDish-${format(date, 'yyyyMMdd')}-${mealId}`;
    return `
      <select name="${name}" class="select select-bordered select-sm bg-white w-28">
        <option disabled selected>Válassz</option>
        ${this.ingredients!.map(({ id, name }) => `<option value="${id}" >${name}</option>`).join('')}
      </select>
      ${this.dishAmount({ name })}
      <div class="text text-right"></div>
      <div class="text text-right"></div>
      <div class="text text-right"></div>
    `;
  }

  mealStats(dishes: DishWithMacros[]) {
    const { mealCals, mealCH, mealFat } = dishes.reduce(
      (acc, dish) => ({
        mealCals: acc.mealCals + dish.calories,
        mealCH: acc.mealCH + dish.carbs,
        mealFat: acc.mealFat + dish.fat,
      }),
      { mealCals: 0, mealCH: 0, mealFat: 0 },
    );

    return `
      <div class="text text-sm italic">Cal: ${mealCals}</div>
      <div class="divider divider-horizontal" ></div> 
      <div class="text text-sm italic">CH: ${mealCH}</div>
      <div class="divider divider-horizontal" ></div> 
      <div class="text text-sm italic">Zsír: ${mealFat}</div>
    `;
  }

  meal(type: string, dishes: DishWithMacros[], date: Date, mealId: string) {
    return `
      <div class="text col-span-1 pl-2">${config.mealTypes[type].name}</div>
      <div class="text col-span-4 flex">${this.mealStats(dishes)}</div>
      <div class="text col-span-2 pl-2"></div>
      <div class="text-sm text-center italic pl-2">cal</div>
      <div class="text-sm text-center italic pl-2">CH</div>
      <div class="text-sm text-center italic pl-2">zsír</div>
      ${dishes.map((dish) => this.dish(dish)).join('')}
      ${this.newDish(date, mealId)}
    `;
  }

  newMeal() {
    return `
      <select name="newMeal" class="select select-bordered select-sm bg-white w-28">
        <option disabled selected>Válassz</option>
        ${Object.entries(config.mealTypes)
          .map(([key, { name }]) => `<option value="${key}" >${name}</option>`)
          .join('')}
      </select
    `;
  }

  dayStats(meals: Omit<MealWithDishMacros, 'date'>[]) {
    const { dayCals, dayCarbs, dayFat } = meals.reduce(
      (acc, meal) =>
        meal.dishes.reduce(
          ({ dayCals, dayCarbs, dayFat }, dish) => ({
            dayCals: dayCals + dish.calories,
            dayCarbs: dayCarbs + dish.carbs,
            dayFat: dayFat + dish.fat,
          }),
          acc,
        ),
      { dayCals: 0, dayCarbs: 0, dayFat: 0 },
    );

    return `
      <div class="flex justify-center items-center">
        <div class="flex flex-col justify-center items-center">
          <div class="text text-center text-sm italic">Cal</div>
          <div class="text text-center">${dayCals}</div>
        </div>
        <div class="divider divider-horizontal" ></div> 
        <div class="flex flex-col justify-center items-center">
          <div class="text text-center text-sm italic">CH</div>
          <div class="text text-center">${dayCarbs}</div>
        </div>
        <div class="divider divider-horizontal" ></div> 
        <div class="flex flex-col justify-center items-center">
          <div class="text text-center text-sm italic">Zsír</div>
          <div class="text text-center">${dayFat}</div>
        </div>
      </div>
  `;
  }

  day(date: Date, meals: Omit<MealWithDishMacros, 'date'>[]) {
    const fullDayStats = `
      <div class="text-lg col-span-4 flex">${this.dayStats(meals)}</div>`
    const partialDaystats = `
      <div class="text-lg col-span-3 flex">${this.dayStats(meals)}</div>
      <button type="button" class="btn btn-secondary btn-sm col-span-1 flex p-0">${icons.add}</button>`;

    return `
      <div class="flex items-center text-lg col-span-1">${format(date, 'MMM. d. (EEE)')}</div>
      ${meals.length < Object.keys(config.mealTypes).length ? partialDaystats : fullDayStats}
      ${meals
        .map(({ id, type, dishes }) => this.meal(type, dishes, date, id))
        .join('<div class="divider divider-secondary col-span-5 m-0 pl-2"></div>')}
    `;
  }

  async render() {
    const days = await repository.fetchDayMeals(this.fromDate, this.toDate);
    this.ingredients = await repository.fetchIngredients();

    return `
      <div id="meal-list" class="grid grid-cols-max-5 grid-row-flex gap-1 py-4">
        ${days.map(({ date, meals }) => this.day(date, meals)).join('<div class="divider divider-primary col-span-5"></div>')}
      </div>`;
  }
}
