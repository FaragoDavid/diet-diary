import config from '../../config.js';

const magnifyingGlass = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>
`;

const ingredientValueInput = (placeholder: String, type: string, width: string) => `
  <input type="${type}" class="input input-bordered w-${width} placeholder:text-xs placeholder:sm:text-base" placeholder=${placeholder}>
`;

const newIngredient = () => {
  const width = `1/${Object.values(config.nutrients).length}`;
  return `
    <div class="flex items-center justify-center space-x-4 space-y-0">
      ${Object.values(config.nutrients)
        .map(({ placeholder, type }) => ingredientValueInput(placeholder, type, width))
        .join('')}
      <div class="flex-none">
        <button class="btn btn-primary sm:hidden">+</button>
        <button class="btn btn-primary hidden sm:block">${config.texts.buttons.add}</button>
      </div>
    </div>
  `;
};

const search = () => `
  <form class="flex space-x-4">
    <input type="text" name="query" class="input input-bordered placeholder:text-xs placeholder:sm:text-base w-full" placeholder="Keresés">
    <button 
      id=search
      type="submit"
      class="btn btn-primary" 
      hx-target="#ingredients"
      hx-post="/ingredients"
    >${magnifyingGlass}</button>
  </form>
`;

export class Ingredients implements BaseComponent {
  public title = config.texts.titles.ingredients;

  async render() {
    return `
    <div class="flex flex-col items-center justify-center space-y-4">
      ${newIngredient()}
      <div class="divider divider-base-200"></div>
      ${search()}
      <div id="ingredients"></div>
    </div>
    `;
  }
}
