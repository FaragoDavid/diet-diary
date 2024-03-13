import config from '../../config.js';

const magnifyingGlass = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>
`;

const propInput = (prop: string, name: String, type: string, width: string) => `
  <input type="${type}" name="${prop}" class="input input-sm input-bordered w-${width} placeholder:text-xs placeholder:sm:text-base" placeholder=${name}>
`;

const newIngredient = () => {
  const width = `1/${Object.values(config.ingredients.props).length}`;
  return `
    <form class="flex items-center justify-center space-x-4 space-y-0">
      ${Object.entries(config.ingredients.props)
        .map(([prop, { name, type }]) => propInput(prop, name, type, width))
        .join('')}
      <div class="flex-none">
        <button 
          class="btn btn-sm btn-primary sm:hidden"
          hx-post="/ingredients"
          hx-target="#ingredient-list"
          hx-swap="outerHTML"
        >+</button>
        <button 
          class="btn btn-sm btn-primary hidden sm:block"
          hx-post="/ingredients"
          hx-target="#ingredient-list"
          hx-swap="outerHTML"
        >${config.ingredients.add}</button>
      </div>
    </form>
  `;
};

const search = () => `
  <label class="input input-sm input-bordered flex items-center gap-2">
    ${magnifyingGlass}
    <input 
      type="text" 
      id=search-ingr
      placeholder="${config.ingredients.search}"
      hx-get="/ingredients"
      hx-target="#ingredient-list"
      hx-trigger="change"
      hx-vals="js:{query: document.getElementById('search-ingr').value}"
      hx-swap="outerHTML"
    ></input>
  </label>
`;

export class Ingredients implements BaseComponent {
  public title = config.ingredients.title;

  async render() {
    return `
    <div class="flex flex-col items-center justify-center space-y-4">
      ${newIngredient()}
      <div class="divider divider-base-200"></div>
      ${search()}
      <div id="ingredient-list"></div>
    </div>
    `;
  }
}
