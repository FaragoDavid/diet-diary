import { addDays, format } from 'date-fns';

import { Day } from '../../repository/meal.js';

export function dayHeader(day: Day) {
  return `
		<div 
			id="day-header" 
			class="text-2xl text-center text-primary"
		>${format(day.date, 'yyyy. MMM. dd.')}</div>
	`;
}

export function newDayHeader() {
  return `<input 
			id="day-header" 
			type="date" min="${format(addDays(new Date(), 1), 'yyyy-MM-dd')}"
			name="date" 
			class="input input-bordered"
			hx-post="/new-day"
			hx-target="#day-header"
			hx-swap="outerHTML"
		>`;
}
