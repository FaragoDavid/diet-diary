import { Day } from '../../repository/meal.js';
import { dateToParam } from '../../utils/converters.js';

enum SPAN {
  NONE = '',
  FIVE = 'col-span-5',
}

export class DayStats implements BaseComponent {
  static SPAN = SPAN;
  span: string;
  swap: boolean;

  constructor(private day: Day, options: { span: `${SPAN}`; swap: boolean }) {
    this.span = options.span;
    this.swap = options.swap;
  }

  async render() {
    const { dayCals, dayCarbs, dayFat } = this.day.meals.reduce(
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
        id="day-${dateToParam(this.day.date)}-stats" 
        class="flex text-lg ${this.span}" 
        ${this.swap ? 'hx-swap-oob="true"' : ''}
      >
        <div class="flex justify-center items-center">
          <div class="flex flex-col justify-center items-center">
            <div class="text text-center text-primary text-sm italic">Kal</div>
            <div class="text text-center text-primary">${Math.floor(dayCals)}</div>
          </div>
          <div class="divider divider-horizontal" ></div> 
          <div class="flex flex-col justify-center items-center">
            <div class="text text-center text-primary text-sm italic">CH</div>
            <div class="text text-center text-primary">${Math.floor(dayCarbs)}</div>
          </div>
          <div class="divider divider-horizontal" ></div> 
          <div class="flex flex-col justify-center items-center">
            <div class="text text-center text-primary text-sm italic">Zsír</div>
            <div class="text text-center text-primary">${Math.floor(dayFat)}</div>
          </div>
        </div>
      </div>
  `;
  }
}
