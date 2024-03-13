import config from '../config.js';
import { Ingredients } from './ingredients/index.js';
import { Overview } from './overview/index.js';
import { Recipes } from './recipes.js';
import { Segment } from './segment.js';

export class Dashboard implements BaseComponent {
  async render() {
    return `
      <div class="container py-5 mx-auto">
        <div class="flex flex-col place-items-center gap-8">
          <div class="text-center text-3xl font-medium w-full  p-4 pe-12">
            ${config.texts.titles.page}
          </div>
          ${await new Segment(new Ingredients()).render()} 
          ${await new Segment(new Recipes()).render()} 
          ${await new Segment(new Overview()).render()} 
        </div>
      </div>
    `;
  }
}
