import config from '../../config.js';
import icons from '../../utils/icons.js';

const propInput = (prop: string, name: String, type: string, width: string) => `
  <input 
    type="${type}" 
    name="${prop}" 
    class="input input-sm input-bordered w-full"
    placeholder=${name}
  >
`;

const y = `    style = 'flex: 1 0 10rem'; `


const newIngredient = () => {
  const width = `1/${Object.values(config.ingredients.props).length}`;
  const propCount = `1/${Object.values(config.ingredients.props).length}`;
  return `
    <div class="grid gap-3 grid-rows-1 grid-flow-col items-center">
      <div class="grid gap-2  sm:grid-rows-1 sm:grid-flow-col">
        ${Object.entries(config.ingredients.props)
          .map(([prop, { name, type }]) => propInput(prop, name, type, width))
          .join('')}
      </div>
      <button 
        class="btn btn-sm btn-primary"
        hx-post="/ingredients"
        hx-target="#ingredient-list"
        hx-swap="outerHTML"
      >${icons.add}</button>
    </div>
  `;
};

const searchIngredients = () => `
  <label class="input input-sm input-bordered flex items-center gap-2">
    ${icons.search}
    <input 
      type="text" 
      id=search-ingr
      placeholder="${config.texts.search}"
      hx-get="/ingredients"
      hx-target="#ingredient-list"
      hx-trigger="input"
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
        ${searchIngredients()}
        <div id="ingredient-list"></div>
      </div>
    `;
  }
}
