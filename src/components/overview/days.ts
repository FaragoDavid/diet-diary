import { eachDayOfInterval } from 'date-fns';

import config from '../../config.js';
import repository, { Dish, Meal } from '../../repository.js';

const header = () => `
  <thead>
    <tr>
      ${config.tableHeaders.meals.map((header) => `<th>${header}</th>`).join('')}
    </tr>
  </thead>
`;

const renderDish = (dish: Dish, dishIndex: number, mealType: string) => `
  <tr>
    <td>${dishIndex === 0 ? config.mealTypes[mealType].name : ''}</td>
    <td>${dish.name}</td>
    <td>${dish.amount}</td>
  </tr> 
`;

const meal = (meal: Meal) => meal.dishes.map((dish: Dish, dishIndex: number) => renderDish(dish, dishIndex, meal.type)).join('');

const day = (date: Date, meals: Meal[]) => `
  <h2 class="text-xl">${date.toLocaleDateString('hu-hu', { month: 'short', day: 'numeric' })}</h2>
  <div class="overflow-x-auto">
    <table class="table table-zebra table-pin-rows">
      ${header()}
      <tbody>
        ${meals.map(meal).join('')}
      </tbody>
    </table>
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

    return days.map(({ date, meals }) => day(date, meals)).join('');
  }
}
