import { subDays } from 'date-fns';
import { FastifyReply, FastifyRequest } from 'fastify';

import { mealTab } from '../../components/meals/meal-tab';
import { TAB_NAME, tabList } from '../../components/tab-list';
import { HTMX_SWAP } from '../../utils/htmx';
import * as ingredientRepository from '../../repository/ingredient';
import * as mealRepository from '../../repository/meal';
import * as recipeRepository from '../../repository/recipe';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const days = await mealRepository.fetchDays();
  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = `
    ${tabList(TAB_NAME.meals, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await mealTab(days, ingredients, recipes)}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/dashboard/${TAB_NAME.meals}`).send(template);
};
