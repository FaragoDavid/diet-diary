import { FastifyReply, FastifyRequest } from 'fastify';

import { DayList } from '../../components/meals/day-list.js';
import { fetchIngredients } from '../../repository/ingredient.js';
import { fetchDays } from '../../repository/meal.js';
import { fetchRecipes } from '../../repository/recipe.js';

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate?: number; toDate?: number } }>;

export default async (request: GetMealsRequest, reply: FastifyReply) => {
  const { fromDate, toDate } = request.query;

  const days = await fetchDays({
    ...(fromDate && { fromDate: new Date(fromDate) }),
    ...(toDate && { toDate: new Date(toDate) }),
  });
  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();

  const template = await new DayList(days, ingredients, recipes, { swap: false }).render();
  return reply.type('text/html').send(template);
};