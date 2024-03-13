import { eachDayOfInterval } from 'date-fns';

import config from '../../config.js';
import repository, { Dish, Meal } from '../../repository.js';

const day = (date: Date, meals: Meal[]) => `
  <h2 class="text-xl">${date.toLocaleDateString('hu-hu', { month: 'short', day: 'numeric' })}</h2>
  <div class="overflow-x-auto">
    <table class="table table-zebra table-pin-rows">
      <thead>
        <tr>
          ${['', 'Név', 'Mennyiség']
            .map((ingredient) => `<th>${ingredient}</th>`)
            .join('')}
        </tr>
      </thead>
      <tbody>
      ${meals.map((meal) => `
          ${meal.dishes.map((dish: Dish, dishIndex: number) => `
            <tr>
              <td>${dishIndex === 0 ? config.mealTypes[meal.type].name : ''}</td>
              <td>${dish.name}</td>
              <td>${dish.amount}</td>
            </tr>
          `).join('')}
      `).join('')}
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
