import config from '../config';

export class Recipes implements BaseComponent {
  async render() {
    return `
      <div class="container py-3 mx-auto">
        <div class="flex flex-col items-center gap-8">
          <div class="flex-none text-center">
            <h2 class="text-2xl mb-2 font-bold">${config.texts.titles.recipes}</h2>
          </div>
        </div>
      </div>
    `;
  }
}
