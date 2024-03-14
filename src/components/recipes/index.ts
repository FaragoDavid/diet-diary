import config from '../../config.js';
import magnifyingGlass from '../../utils/magnifying-glass.js';

const propInput = (prop: string, name: String, type: string, width: string) => `
  <input type="${type}" name="${prop}" class="input input-sm input-bordered w-${width} placeholder:text-xs placeholder:sm:text-base" placeholder=${name}>
`;

const newRecipe = () => {
  const width = `1/${Object.values(config.recipes.props).length}`;
  return `
    <form class="flex items-center justify-center space-x-4 space-y-0">
      ${Object.entries(config.recipes.props)
        .map(([prop, { name, type }]) => propInput(prop, name, type, width))
        .join('')}
      <div class="flex-none">
        <button 
          class="btn btn-sm btn-primary sm:hidden"
          hx-post="/recipes"
          hx-target="#recipe-list"
          hx-swap="outerHTML"
        >+</button>
        <button 
          class="btn btn-sm btn-primary hidden sm:block"
          hx-post="/recipes"
          hx-target="#recipe-list"
          hx-swap="outerHTML"
        >${config.texts.add}</button>
      </div>
    </form>
  `;
};

const search = () => `
  <label class="input input-sm input-bordered flex items-center gap-2">
    ${magnifyingGlass}
    <input 
      type="text" 
      id=search-recipe
      placeholder="${config.texts.search}"
      hx-get="/recipes"
      hx-target="#recipe-list"
      hx-trigger="input"
      hx-vals="js:{query: document.getElementById('search-recipe').value}"
      hx-swap="outerHTML"
    ></input>
  </label>
`;

const renderRecipe = (recipe) => `
  <tr>
    <td>${recipe.name}</td>
    <td>${recipe.recipes.map((recipe) => `${recipe.name} (${recipe.amount})`).join(', ')}</td>
  </tr>
`;

export class Recipes implements BaseComponent {
  public title = config.recipes.title;

  async render() {
    return `
        <div class="flex flex-col items-center justify-center space-y-4">
        ${newRecipe()}
        <div class="divider divider-base-200"></div>
        ${search()}
        <div id="recipe-list"></div>
      </div>
    `;
  }
}
