import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';

import icons from '../../utils/icons';
import { stats } from '../stats';
import { INGREDIENT_SEARCH_ID } from './ingredient-tab';

export async function ingredientListItem(ingredient: Ingredient) {
  const name = () => {
    return `<div class="text-sm text-wrap max-w-24">${ingredient.name}</div>`;
  };

  const editButton = () => {
    return `
      <div class="flex justify-center items-center pl-2">
        <a href="/ingredient/${ingredient.id}" class="btn btn-xs btn-secondary">
          ${icons.edit}
        </a>
      </div>
    `;
  };

  const deleteButton = () => {
    return `
      <div class="flex justify-center items-center">
        <div
          class="btn btn-xs"
          hx-delete="/ingredient/${ingredient.id}"
          hx-target="this"
          hx-swap="outerHTML"
          hx-vals="js:{query: document.getElementById('${INGREDIENT_SEARCH_ID}').value}"
        >
          ${icons.delete}
        </div>
      </div>
    `;
  };

  return `
    ${name()}
    ${stats(
      {
        cal: ingredient.caloriesPer100 || 0,
        carbs: ingredient.carbsPer100 || 0,
        fat: ingredient.fatPer100 || 0,
      },
      { layout: 'cells', size: 'sm', swapOob: false },
    )}
    ${editButton()}
    ${deleteButton()}
  `;
}
