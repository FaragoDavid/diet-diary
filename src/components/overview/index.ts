import { format, subDays } from 'date-fns';
import config from '../../config.js';
import { Days } from './days.js';

const dateInput = (id: string, defaultValue: Date) => `
  <input
    id="${id}"
    type="date"
    class="border rounded px-2 py-1"
    value="${format(defaultValue, 'yyyy-MM-dd')}"
    hx-get="/days"
    hx-target="#days"
    hx-trigger="change"
    hx-vals="js:{fromDate: document.getElementById('fromDate').value, toDate: document.getElementById('toDate').value}"
  />
`;

export class Overview implements BaseComponent {
  async render() {
    const fromDate = subDays(new Date(), 7);
    const toDate = new Date();
    
    return `
      <div tabindex="0" class="collapse collapse-open collapse-arrow  bg-base-300">
        <div class="collapse-title text-center text-2xl font-medium">
          ${config.texts.titles.overview}
        </div>

        <div class="collapse-content  px-4 pe-12">
          <div class="flex items-center justify-center space-x-4">
            ${dateInput('fromDate', fromDate)}
            <span class="text-center">-</span>
            ${dateInput('toDate', toDate)}
          </div>

          <div id="days" class="flex flex-col gap-6 w-full">
            ${await new Days(fromDate, toDate).render()}
          </div>
        </div>
      </div>
    `;
  }
}
