import { FastifyReply, FastifyRequest } from 'fastify';

import { recipeTab } from '../../components/recipes/recipe-tab';
import { TAB_NAME, tabList } from '../../components/tab-list';
import { HTMX_SWAP } from '../../utils/htmx';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const recipes = await recipeRepository.fetchRecipes('');
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${tabList(TAB_NAME.recipes, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await recipeTab(recipes, ingredients)}
  `;

  return { template, url: `/dashboard/${TAB_NAME.recipes}` };
};
