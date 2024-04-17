import { addDays, format } from 'date-fns';
import { Day } from '../../repository/meal.js';

function editHeader(day: Day) {
  return `
		<div 
			id="day-header" 
			class="text-2xl text-center"
			hx-swap-oob="true"
		>${format(day.date, 'yyyy. MMM. dd.')}</div>
	`;
}

export function dayHeader(type: 'create' | 'edit'): string | typeof editHeader {
  switch (type) {
    case 'create':
      return `<input 
				id="day-header" 
				type="date" min="${format(addDays(new Date(), 1), 'yyyy-MM-dd')}"
				name="date" 
				class="input input-bordered"
				hx-post="/new-day"
			>
		`;
    case 'edit':
      return editHeader;
  }
}
