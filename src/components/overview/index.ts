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
  public title = config.texts.titles.overview;

  async render() {
    // const fromDate = subDays(new Date(), 7);
    // const toDate = new Date();
    const fromDate = new Date('2024-02-02T00:00:00');
    const toDate = new Date(new Date('2024-02-03T00:00:00'));

    return `
      <div class="flex justify-center items-center space-x-4">
        ${dateInput('fromDate', fromDate)}
        <span class="text-center">-</span>
        ${dateInput('toDate', toDate)}
      </div>

      <div id="days" class="flex flex-col justify-center items-center gap-6 w-full">
        ${await new Days(fromDate, toDate).render()}
      </div>
    `;
  }
}
