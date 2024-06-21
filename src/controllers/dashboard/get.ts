import { subDays } from 'date-fns';
import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout.js';
import { TAB_NAME } from '../../components/tab-list.js';
import { Dashboard } from '../../pages/dashboard.js';
import { fetchIngredients } from '../../repository/ingredient.js';
import { fetchDays } from '../../repository/meal.js';
import { fetchRecipes } from '../../repository/recipe.js';

type GetDashboardRequest = FastifyRequest<{ Params: { target: `${TAB_NAME}` } }>;

export default async (request: GetDashboardRequest, reply: FastifyReply) => {
  const { target } = request.params;
  const fromDate = subDays(new Date(), 7);
  const toDate = new Date();
  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();
  const days = await fetchDays(fromDate, toDate);

  const template = await layout(new Dashboard(target, ingredients, recipes, days));
  return reply.type('text/html').send(template);
};
