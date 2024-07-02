import { Ingredient } from '@prisma/client';

import config from '../../config';
import { HTMX_SWAP } from '../../utils/htmx';
import icons from '../../utils/icons';
import { TAB_CONTAINER_ID } from '../tab-list';
import { INGREDIENT_LIST_ID, IngredientList } from './ingredient-list';

export const INGREDIENT_SEARCH_ID = 'ingredient-search';

export class IngredientTab implements BaseComponent {
  constructor(private ingredients: Ingredient[]) {}

  addIngredient = () => {
    return `
      <a href="/new-ingredient">
        <button type="submit" class="btn btn-primary btn-sm">${icons.add}</button>
      </a>
    `;
  };

  ingredientSearch = () => {
    return `
      <label class="input input-sm input-bordered flex items-center gap-2">
        ${icons.search}
        <input id=${INGREDIENT_SEARCH_ID}
          type="text" 
          placeholder="${config.texts.search}"
          hx-get="/ingredients"
          hx-target="#${INGREDIENT_LIST_ID}"
          hx-swap="${HTMX_SWAP.ReplaceElement}"
          hx-trigger="input"
          hx-vals="js:{query: document.getElementById('${INGREDIENT_SEARCH_ID}').value}"
        />
      </label>
    `;
  };

  async render() {
    return `  
      <div id="${TAB_CONTAINER_ID}" class="flex flex-col justify-center items-center space-y-4">
        <div class="flex justify-center items-center space-x-2">
          ${this.ingredientSearch()}
          <div class="divider divider-horizontal"></div>
          <a href="/new-ingredient">
            <button type="submit" class="btn btn-primary btn-sm">${icons.add}</button>
          </a>
        </div>
        ${await new IngredientList(this.ingredients, { swapOob: false }).render()}
      </div>
    `;
  }
}
