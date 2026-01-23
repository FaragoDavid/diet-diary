import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';
import { RecipeWithIngredients } from '../../repository/recipe';
import icons from '../../utils/icons';
import { amount as amountInput } from '../amount';
import { recipeStats } from './recipe-stats';
import { RECIPE_SEARCH_ID } from './recipe-tab';

export async function recipeListItem(recipe: RecipeWithIngredients, ingredients: Ingredient[]) {
  const name = () => {
    return (<div class="text">{recipe.name}</div>) as string;
  };

  const amount = () => {
    return amountInput({
      amount: recipe.amount || 0,
      name: 'amount',
      showText: false,
      hx: { verb: 'post', url: `/recipe/${recipe.id}/amount` },
    });
  };

  const editButton = () => {
    const link = (<a href={`/recipe/${recipe.id}`} class="btn btn-sm btn-secondary" />) as string;

    return (<div class="flex justify-center items-center row-span-2">{link.replace('/>', `>${icons.edit}</a>`)}</div>) as string;
  };

  const deleteButton = () => {
    const button = (
      <div
        class="btn btn-sm"
        hx-delete={`/recipe/${recipe.id}`}
        hx-target="this"
        hx-swap="outerHTML"
        hx-vals={`js:{query: document.getElementById('${RECIPE_SEARCH_ID}').value}`}
      />
    ) as string;

    return (<div class="flex justify-center items-center row-span-2">{button.replace('/>', `>${icons.delete}</div>`)}</div>) as string;
  };

  const statsHtml = await recipeStats(recipe, {
    id: `recipe-${recipe.id}-stats`,
    layout: 'horizontal',
    size: 'sm',
    span: 'col-span-2',
    swapOob: false,
  });

  return `
    ${name()}
    ${amount()}
    ${editButton()}
    ${deleteButton()}
    ${statsHtml}
  `;
}
