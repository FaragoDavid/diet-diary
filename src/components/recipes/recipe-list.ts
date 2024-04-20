import { Ingredient } from '../../repository/ingredient.js';
import { Recipe } from '../../repository/recipe.js';
import icons from '../../utils/icons.js';
import { RecipeStats } from './recipe-stats.js';

export class RecipeList implements BaseComponent {
  constructor(private recipes: Recipe[], private ingredients: Ingredient[]) {}

  recipeAmount(recipe: Recipe) {
    return `
      <div class="flex justify-center items-center">
        <input 
          id="amount-${recipe.id}"
          type="number"
          class="input input-xs input-bordered w-16  pr-5 text-right peer placeholder:text-neutral placeholder:text-xs" 
          ${recipe.amount ? `value="${recipe.amount}"` : ''}
          placeholder="0"
          hx-trigger="change"
          hx-target="#recipe-list"
          hx-post="/recipe/${recipe.id}"
          hx-vals="js:{
            amount: document.getElementById('amount-${recipe.id}').value,
            query: document.getElementById('search-recipe').value
          }"
        >
          <span class="relative right-4 text-xs peer-[:placeholder-shown]:text-neutral">g</span>
        </input>
      </div>
    `;
  }

  recipeName(name: string) {
    return `<div class="text">${name}</div>`;
  }

  editRecipeButton(recipe: Recipe) {
    return `
      <div class="flex justify-center items-center row-span-2">
        <a 
          href="/recipe/${recipe.id}" 
          class="btn btn-sm btn-primary"
        >${icons.edit}</a>
      </div>
    `;
  }

  async renderRecipe(recipe: Recipe) {
    return `
      ${this.recipeName(recipe.name)}
      ${this.recipeAmount(recipe)}
      ${this.editRecipeButton(recipe)}
        ${await new RecipeStats(recipe, this.ingredients).render()}
    `;
  }

  async render() {
    let recipeComponents: string[] = [];
    for (const recipe of this.recipes) {
      recipeComponents.push(await this.renderRecipe(recipe));
    }

    return `
      <div id="recipe-list" class="grid grid-cols-max-3 grid-row-flex gap-2">
        ${recipeComponents.join('')}
      </div>
    `;
  }
}
