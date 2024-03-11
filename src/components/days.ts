import { eachDayOfInterval } from 'date-fns';

import config from '../config.js';
import repository, { Dish, Meal } from '../repository.js';

const renderDish = (dish: Dish, index: number, mealType: string) => `
  <div class="flex w-full">
    <div class="flex w-1/3">${index === 0 ? config.mealTypes[mealType].name : ''}</div>
    <div class="flex w-1/3">${dish.name}</div>
    <div class="flex w-1/3">${dish.amount}</div>
  </div>
`;

const renderMeals = (meals: Meal[]) => `
  <div class="flex flex-col gap-2 w-full">
    <div class="flex gap-2 w-full">
      <div class="flex w-1/3"></div>
      <div class="flex w-1/3">Alapanyag</div>
      <div class="flex w-1/3">Mennyiség</div>
    </div>
    ${meals.map(
      (meal, index) => `
        ${meal.dishes.map((dish, index) => renderDish(dish, index, meal.type)).join('')}
        <hr class="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" ?hidden=${index === meals.length - 1} />
      `,
    ).join('')}
  </div>
`;

export class Days implements BaseComponent {
  constructor(private fromDate: Date, private toDate: Date) {}

  async render() {
    const days: { date: Date; meals: Meal[] }[] = [];
    for (const day of eachDayOfInterval({ start: this.fromDate, end: this.toDate })) {
      const meals = await repository.fetchDay(day);
      if (meals.length > 0) days.push({ date: day, meals });
    }

    return days
      .map(
        ({ date, meals }, index) => `
          <div class="flex flex-col  w-full">
            <h3 class="text-xl">${date.toLocaleDateString('hu-hu', { month: 'short', day: 'numeric', weekday: 'short' })}</h3>
            ${renderMeals(meals)}
            <hr class="h-1 my-2 bg-gray-200 border-0 dark:bg-gray-700" ?hidden=${index === days.length - 1} />
          </div>
        `,
      )
      .join('');
  }
}
