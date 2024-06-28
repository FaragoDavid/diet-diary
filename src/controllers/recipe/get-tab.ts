import { FastifyReply, FastifyRequest } from 'fastify';

import { RecipeTab } from '../../components/recipes/recipe-tab';
import { TAB_NAME, tabList } from '../../components/tab-list';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';
import { HTMX_SWAP } from '../../utils/htmx';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const recipes = await recipeRepository.fetchRecipes('');
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${tabList(TAB_NAME.recipes, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await new RecipeTab(recipes, ingredients).render()}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/dashboard/${TAB_NAME.recipes}`).send(template);
};
