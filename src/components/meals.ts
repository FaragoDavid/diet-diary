import config from '../config.js';

export class Meals implements BaseComponent {
  async render() {
    return `
      <div class="container py-3 mx-auto">
        <div class="flex flex-col items-center gap-8">
          <div class="flex-none text-center">
            <h2 class="text-2xl mb-2 font-bold">${config.texts.titles.meals}</h2>
          </div>

          <div class="flex">
            <input
              id="fromDate"
              type="date"
              class="border rounded px-2 py-1"
              hx-get="/meals"
              hx-target="#meals"
              hx-trigger="change"
              hx-vals="js:{
                fromDate: document.getElementById('fromDate').value, 
                toDate: document.getElementById('toDate').value
              }"
            />
            <span class="mx-2">-</span>
            <input
              id="toDate"
              type="date"
              class="border rounded px-2 py-1"
              hx-get="/meals"
              hx-target="#meals"
              hx-trigger="change"
              hx-vals="js:{fromDate: document.getElementById('fromDate').value, toDate: document.getElementById('toDate').value}"
            />
          </div>

          <div id="meals" class="flex flex-col gap-6 w-full"></div>
        </div>
      </div>
    `;
  }
}
