import config from '../../config.js';
import icons from '../../utils/icons.js';

const addRecipe = () => {
  return `
    <a href="/new-recipe">
        <button 
          type="submit"
          class="btn btn-primary btn-sm"
        >${icons.add}</button>
    </a>
  `;
};

const searchRecipes = () => `
  <label class="input input-sm input-bordered flex items-center gap-2">
    ${icons.search}
    <input 
      type="text" 
      id="search-recipe"
      placeholder="${config.texts.search}"
      hx-get="/recipes"
      hx-target="#recipe-list"
      hx-trigger="input"
      hx-vals="js:{query: document.getElementById('search-recipe').value}"
      hx-swap="outerHTML"
    ></input>
  </label>
`;

export class RecipeTab implements BaseComponent {
  public title = config.recipes.title;

  async render() {
    return `
      <div class="flex flex-col justify-center items-center space-y-4">
        <div class="flex justify-center items-center space-x-2">
          ${searchRecipes()}
          <div class="divider divider-horizontal" ></div> 
          ${addRecipe()}
        </div>
        <div id="recipe-list"></div>
      </div>
    `;
  }
}
