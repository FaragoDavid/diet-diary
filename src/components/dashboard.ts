import config from '../config.js';
import { Meals } from './meals.js';
import { Recipes } from './recipes.js';

export class Dashboard implements BaseComponent {
  async render() {
    return `
      <div class="flex flex-col gap-8 w-full">
        <h2 class="text-3xl text-center font-bold mb-2">${config.texts.titles.meals}</h2>

        <div class="flex gap-6 w-full">${await new Meals().render()} ${await new Recipes().render()}</div>
      </div>
    `;
  }
}
