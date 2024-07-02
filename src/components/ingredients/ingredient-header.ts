import { Ingredient } from '@prisma/client';

import { INGREDIENT_PAGE_ID } from '../../pages/ingredient';

const texts = {
  placeholder: 'Alapanyag neve',
};
const ID = 'ingredient-header';

export function newIngredientHeader() {
  return `
    <div class="pb-6">
      <input 
        id="${ID}"
        type="text" 
        name="ingredientName" 
        class="input input-bordered"
        placeholder="${texts.placeholder}"
        hx-post="/new-ingredient"
        hx-target="#${INGREDIENT_PAGE_ID}"
      />
    </div>
  `;
}

export function ingredientHeader(ingredient: Ingredient) {
  return `
		<div 
			id="${ID}"
			class="text-2xl text-center text-primary pb-6"
		>${ingredient.name}</div>
	`;
}