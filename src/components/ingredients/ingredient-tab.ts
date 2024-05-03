import { Ingredient } from '../../repository/ingredient.js';
import config from '../../config.js';
import icons from '../../utils/icons.js';
import { INGREDIENT_LIST_ID, IngredientList } from './ingredient-list.js';
import { TAB_CONTAINER_ID } from '../tab-list.js';

export const INGREDIENT_SEARCH_ID = 'ingredient-search';

const addIngredient = () => {
  return `
    <a href="/new-ingredient">
        <button 
          type="submit"
          class="btn btn-primary btn-sm"
        >${icons.add}</button>
    </a>
  `;
};

const ingredientSearch = () => `
  <label class="input input-sm input-bordered flex items-center gap-2">
    ${icons.search}
    <input 
      type="text" 
      id=${INGREDIENT_SEARCH_ID}
      placeholder="${config.texts.search}"
      hx-get="/ingredients"
      hx-target="#${INGREDIENT_LIST_ID}"
      hx-swap="outerHTML"
      hx-trigger="input"
      hx-vals="js:{query: document.getElementById('${INGREDIENT_SEARCH_ID}').value}"
    ></input>
  </label>
`;

export class IngredientTab implements BaseComponent {
  constructor(private ingredients: Ingredient[]) {}

  async render() {
    return `  
      <div id="${TAB_CONTAINER_ID}" class="flex flex-col justify-center items-center space-y-4">
        <div class="flex justify-center items-center space-x-2">
          ${ingredientSearch()}
          <div class="divider divider-horizontal"></div>
          ${addIngredient()}
        </div>
        ${await new IngredientList(this.ingredients, { swap: false }).render()}
      </div>
    `;
  }
}
