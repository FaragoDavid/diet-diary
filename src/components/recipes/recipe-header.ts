import { RECIPE_PAGE_ID } from "../../pages/recipe.js";

const texts = {
  placeholder: 'Recept neve',
};
const ID = 'recipe-header';

export function newRecipeHeader() {
  return `
      <input 
        id="${ID}"
        type="text" 
        name="recipeName" 
        class="input input-bordered"
        placeholder="${texts.placeholder}"
        hx-post="/new-recipe"
        hx-target="#${RECIPE_PAGE_ID}"
      />
  `;
}

export function recipeHeader(recipe) {
  return `
		<div 
			id="${ID}"
			class="text-2xl text-center text-primary"
		>${recipe.name}</div>
	`;
}