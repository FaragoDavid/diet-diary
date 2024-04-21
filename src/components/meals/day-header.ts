import { addDays, format } from 'date-fns';

import { Day } from '../../repository/meal.js';
import { dateToInput } from '../../utils/converters.js';

const ID = 'day-header';

export function dayHeader(day: Day) {
  return `
		<div 
			id="${ID}"
			class="text-2xl text-center text-primary"
		>${format(day.date, 'yyyy. MMM. dd.')}</div>
	`;
}

export function newDayHeader() {
  return `<input 
			id="${ID}"
			type="date" min="${dateToInput(addDays(new Date(), 1))}"
			name="date" 
			class="input input-bordered"
			hx-post="/new-day"
			hx-target="#day-header"
			hx-swap="outerHTML"
		>`;
}
