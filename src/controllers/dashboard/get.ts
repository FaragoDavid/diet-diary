import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout';
import { TAB_NAME } from '../../components/tab-list';
import { Dashboard } from '../../pages/dashboard';
import { fetchIngredients } from '../../repository/ingredient';
import { fetchDays } from '../../repository/meal';
import { fetchRecipes } from '../../repository/recipe';

type GetDashboardRequest = FastifyRequest<{ Params: { target: `${TAB_NAME}` } }>;

export default async (request: GetDashboardRequest, reply: FastifyReply) => {
  const { target } = request.params;
  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();
  const days = await fetchDays();

  const template = await layout(new Dashboard(target, ingredients, recipes, days));
  return reply.type('text/html').send(template);
};
