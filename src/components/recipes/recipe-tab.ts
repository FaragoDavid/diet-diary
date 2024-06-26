import { Ingredient } from '@prisma/client';

import config from '../../config';
import { RecipeWithIngredients } from '../../repository/recipe';
import icons from '../../utils/icons';
import { TAB_CONTAINER_ID } from '../tab-list';
import { RECIPE_LIST_ID, RecipeList } from './recipe-list';

export const RECIPE_SEARCH_ID = 'search-recipe';

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
      id="${RECIPE_SEARCH_ID}"
      placeholder="${config.texts.search}"
      hx-get="/recipes"
      hx-target="#${RECIPE_LIST_ID}"
      hx-trigger="input"
      hx-vals="js:{query: document.getElementById('${RECIPE_SEARCH_ID}').value}"
      hx-swap="outerHTML"
    ></input>
  </label>
`;

export class RecipeTab implements BaseComponent {
  constructor(private recipes: RecipeWithIngredients[], private ingredients: Ingredient[]) {}

  async render() {
    return `
      <div id="${TAB_CONTAINER_ID}" class="flex flex-col justify-center items-center space-y-4">
        <div class="flex justify-center items-center space-x-2">
          ${searchRecipes()}
          <div class="divider divider-horizontal" ></div> 
          ${addRecipe()}
        </div>
        ${await new RecipeList(this.recipes, this.ingredients, { swapOob: false }).render()}
      </div>
    `;
  }
}
