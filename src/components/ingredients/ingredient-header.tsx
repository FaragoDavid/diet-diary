import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';

import { INGREDIENT_PAGE_ID } from '../../pages/ingredient';

const texts = {
  placeholder: 'Alapanyag neve',
};
const ID = 'ingredient-header';

export function newIngredientHeader(): string {
  return (
    <div class="pb-6">
      <input
        id={ID}
        type="text"
        name="ingredientName"
        class="input input-bordered"
        placeholder={texts.placeholder}
        hx-post="/new-ingredient"
        hx-target={`#${INGREDIENT_PAGE_ID}`}
      />
    </div>
  ) as string;
}

export function ingredientHeader(ingredient: Ingredient): string {
  return (
    <div id={ID} class="text-2xl text-center text-primary pb-6">
      {ingredient.name}
    </div>
  ) as string;
}
