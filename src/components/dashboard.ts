import { html } from 'lit';
import { SsrLitElement } from '../lib/ssr-lit-element.js';
import config from '../config.js';

export class Dashboard extends SsrLitElement {
  constructor() {
    super();
  }

  async render() {
    return html`
      <div class="flex gap-8">
        <h2 class="text-3xl mb-2 font-bold">${config.texts.pageTitle}</h2>
      </div>
    `;
  }
}
