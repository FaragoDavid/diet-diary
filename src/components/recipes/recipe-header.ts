import { RECIPE_PAGE_ID } from '../../pages/recipe';
import { RecipeWithIngredients } from '../../repository/recipe';

const texts = {
  placeholder: 'Recept neve',
};
const ID = 'recipe-header';

export function newRecipeHeader() {
  return `
    <div class="pb-6">
      <input 
        id="${ID}"
        type="text" 
        name="recipeName" 
        class="input input-bordered"
        placeholder="${texts.placeholder}"
        hx-post="/new-recipe"
        hx-target="#${RECIPE_PAGE_ID}"
      />
    </div>
  `;
}

export function recipeHeader(recipe: RecipeWithIngredients) {
  return `
		<div 
			id="${ID}"
			class="text-2xl text-center text-primary pb-6"
		>${recipe.name}</div>
	`;
}