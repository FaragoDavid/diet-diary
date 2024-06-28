import { subDays } from 'date-fns';
import { FastifyReply, FastifyRequest } from 'fastify';

import { MealTab } from '../../components/meals/meal-tab';
import { TAB_NAME, tabList } from '../../components/tab-list';
import { fetchIngredients } from '../../repository/ingredient';
import { fetchDays } from '../../repository/meal';
import { HTMX_SWAP } from '../../utils/htmx';
import { fetchRecipes } from '../../repository/recipe';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();

  const fromDate = subDays(new Date(), 7);
  const toDate = new Date();
  const days = await fetchDays();

  const template = `
    ${tabList(TAB_NAME.meals, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await new MealTab(days, ingredients, recipes).render()}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/dashboard/${TAB_NAME.meals}`).send(template);
};