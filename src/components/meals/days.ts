import { format } from 'date-fns';

import config from '../../config.js';
import { Ingredient } from '../../repository/ingredient.js';
import { Day, Dish, Meal } from '../../repository/meal.js';
import { DayStats } from './day-stats.js';
import { MealComponent } from './meal.js';

export class Days implements BaseComponent {
  constructor(private days: Day[], private ingredients: Ingredient[]) {}

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

  dish({ name, amount, calories, carbs, fat }: Dish) {
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
        ${this.ingredients.map(({ id, name }) => `<option value="${id}" >${name}</option>`).join('')}
      </select>
      ${this.dishAmount({ name })}
      <div class="text text-right"></div>
      <div class="text text-right"></div>
      <div class="text text-right"></div>`;
  }

  mealStats(dishes: Dish[]) {
    const { mealCals, mealCH, mealFat } = dishes.reduce(
      (acc, dish) => ({
        mealCals: acc.mealCals + dish.calories,
        mealCH: acc.mealCH + dish.carbs,
        mealFat: acc.mealFat + dish.fat,
      }),
      { mealCals: 0, mealCH: 0, mealFat: 0 },
    );

    return `
      <div class="text text-sm text-secondary italic">Kal: ${mealCals}</div>
      <div class="divider divider-horizontal" ></div> 
      <div class="text text-sm text-secondary italic">CH: ${mealCH}</div>
      <div class="divider divider-horizontal" ></div> 
      <div class="text text-sm text-secondary italic">Zsír: ${mealFat}</div>
    `;
  }

  meal(type: string, dishes: Dish[]) {
    return `
      <div class="text text-secondary col-span-1 pl-2">${config.mealTypes.find(({ key }) => key === type)!.name}</div>
      <div class="text col-span-2 flex">${this.mealStats(dishes)}</div>
    `;
  }

  dayStats(meals: Omit<Meal, 'date'>[]) {
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
      <div 
        class="flex justify-center items-center 
        col-span-2"
      >
        <div class="flex flex-col justify-center items-center">
          <div class="text text-center text-primary text-sm italic">Kal</div>
          <div class="text text-center text-primary">${dayCals}</div>
        </div>
        <div class="divider divider-horizontal" ></div> 
        <div class="flex flex-col justify-center items-center">
          <div class="text text-center text-primary text-sm italic">CH</div>
          <div class="text text-center text-primary">${dayCarbs}</div>
        </div>
        <div class="divider divider-horizontal" ></div> 
        <div class="flex flex-col justify-center items-center">
          <div class="text text-center text-primary text-sm italic">Zsír</div>
          <div class="text text-center text-primary">${dayFat}</div>
        </div>
      </div>
  `;
  }

  async day(day: Day) {
    const mealComponents: string[] = [];
    for (const meal of day.meals) {
      mealComponents.push(await new MealComponent({ ...meal, date: day.date }, this.ingredients, MealComponent.STATS_SPAN.TWO, false).render());
    }

    return `
      <div class="flex items-center text-lg text-primary col-span-1">${format(day.date, 'MMM. d. (EEE)')}</div>
      ${await new DayStats(day, DayStats.SPAN.TWO).render()}
      ${mealComponents.join('<div class="divider divider-secondary col-span-3 m-0 pl-2"></div>')}
    `;
  }

  async render() {
    const dayComponents: string[] = [];
    for (const day of this.days) {
      dayComponents.push(await this.day(day));
    }

    return `
      <div id="meal-list" class="grid grid-cols-max-3 grid-row-flex gap-1 py-4">
        ${dayComponents.join('<div class="divider divider-primary col-span-3"></div>')}
      </div>`;
  }
}
