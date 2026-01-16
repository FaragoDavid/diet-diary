import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';
import config from '../../config';
import { RecipeWithIngredients } from '../../repository/recipe';
import icons from '../../utils/icons';
import { TAB_CONTAINER_ID } from '../tab-list';
import { RECIPE_LIST_ID, RecipeList } from './recipe-list';

export const RECIPE_SEARCH_ID = 'search-recipe';

const addRecipe = (): string => {
  const button = (<button type="submit" class="btn btn-primary btn-sm" />) as string;

  return (<a href="/new-recipe">{button.replace('/>', `>${icons.add}</button>`)}</a>) as string;
};

const searchRecipes = (): string => {
  const input = (
    <input
      type="text"
      id={RECIPE_SEARCH_ID}
      placeholder={config.texts.search}
      hx-get="/recipes"
      hx-target={`#${RECIPE_LIST_ID}`}
      hx-trigger="input"
      hx-vals={`js:{query: document.getElementById('${RECIPE_SEARCH_ID}').value}`}
      hx-swap="outerHTML"
    />
  ) as string;

  return (
    <label class="input input-sm input-bordered flex items-center gap-2">
      {icons.search}
      {input}
    </label>
  ) as string;
};

export class RecipeTab implements BaseComponent {
  constructor(private recipes: RecipeWithIngredients[], private ingredients: Ingredient[]) {}

  async render(): Promise<string> {
    const recipeListHtml = await new RecipeList(this.recipes, this.ingredients, { swapOob: false }).render();

    return `
      <div id="${TAB_CONTAINER_ID}" class="flex flex-col justify-center items-center space-y-4">
        <div class="flex justify-center items-center space-x-2">
          ${searchRecipes()}
          <div class="divider divider-horizontal"></div> 
          ${addRecipe()}
        </div>
        ${recipeListHtml}
      </div>
    `;
  }
}
