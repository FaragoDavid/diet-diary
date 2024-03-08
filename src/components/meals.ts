import { html } from 'lit';
import { SsrLitElement } from '../lib/ssr-lit-element.js';
import config from '../config.js';
import { Days } from './days.js';

export class Meals extends SsrLitElement {
  constructor() {
    super();
  }

  async render() {
    const today = new Date();

    return html`
      <div class="container py-3 mx-auto">
        <div class="flex flex-col items-center gap-8">
          <div class="flex-none text-center">
            <h2 class="text-2xl mb-2 font-bold">${config.texts.titles.meals}</h2>
          </div>

          <div class="flex">
            <input type="date" id="fromDate" name="dateInterval" class="border rounded px-2 py-1" />
            <span class="mx-2">-</span>
            <input type="date" id="toDate" name="dateInterval" class="border rounded px-2 py-1" value="${today}" />
          </div>

          ${await new Days(new Date('2024-03-01'), new Date('2024-03-08')).render()}
        </div>
      </div>
    `;
  }
}
