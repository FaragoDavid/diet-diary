import { addDays, format } from 'date-fns';

import { DAY_PAGE_ID } from '../../pages/day';
import { DayWithMealsWithDishes } from '../../repository/meal';
import { dateToInput } from '../../utils/converters';

const ID = 'day-header';

export function newDayHeader() {
  return `
		<div>
      <input 
        id="${ID}"
				type="date" 
				name="date" 
        class="input input-bordered"
				min="${dateToInput(addDays(new Date(), 1))}"
				hx-post="/new-day"
				hx-target="#${DAY_PAGE_ID}"
      />
    </div>`;
}

export function dayHeader(day: DayWithMealsWithDishes) {
  return `
		<div 
			id="${ID}"
			class="text-2xl text-center text-primary"
		>${format(day.date, 'yyyy. MMM. dd.')}</div>
	`;
}
