import { Ingredient } from '../../repository/ingredient.js';
import { Recipe } from '../../repository/recipe.js';
import { RecipeListItem } from './recipe-list-item.js';

export class RecipeList implements BaseComponent {
  constructor(private recipes: Recipe[], private ingredients: Ingredient[]) {}

  async render() {
    let recipeComponents: string[] = [];
    for (const recipe of this.recipes) {
      recipeComponents.push(await new RecipeListItem(recipe, this.ingredients).render());
    }

    return `
      <div id="recipe-list" class="grid grid-cols-max-3 grid-row-flex gap-2">
        ${recipeComponents.join('')}
      </div>
    `;
  }
}
