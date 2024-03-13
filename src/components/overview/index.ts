import config from '../../config.js';

const renderDateInput = (id: string) => `
  <input
    id="${id}"
    type="date"
    class="border rounded px-2 py-1"
    hx-get="/days"
    hx-target="#days"
    hx-trigger="change"
    hx-vals="js:{fromDate: document.getElementById('fromDate').value, toDate: document.getElementById('toDate').value}"
  />
`;

export class Overview implements BaseComponent {
  async render() {
    return `
      <div class="container bg-base-200 py-3 mx-auto">
        <div class="flex flex-col items-center gap-8">
          <div class="flex-none text-center">
            <h2 class="text-2xl mb-2 font-bold">${config.texts.titles.meals}</h2>
          </div>

          <div class="flex">
            ${renderDateInput('fromDate')}
            <span class="mx-2">-</span>
            ${renderDateInput('toDate')}
          </div>

          <div id="days" class="flex flex-col gap-6 w-full"></div>
        </div>
      </div>
    `;
  }
}
