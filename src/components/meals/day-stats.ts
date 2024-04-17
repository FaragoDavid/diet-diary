import { format } from 'date-fns';
import { Day } from '../../repository/meal.js';

export class DayStats implements BaseComponent {
  constructor(private day: Day, private swap: boolean = false) {}

  async render() {
    const { dayCals, dayCarbs, dayFat } = this.day!.meals.reduce(
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
        id="${format(this.day.date, 'yyyyMMdd')}-stats" 
        class="text-lg col-span-5" 
        ${this.swap ? `hx-swap-oob="true"` : ''}
      >
        <div class="flex justify-center items-center">
          <div class="flex flex-col justify-center items-center">
            <div class="text text-center text-primary text-sm italic">Cal</div>
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
      </div>
  `;
  }
}
