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
        hx-target="#recipe-container"
        hx-swap="outerHTML"
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