import { FastifyReply, FastifyRequest } from 'fastify';

import { DayList } from '../../components/meals/day-list.js';
import { fetchIngredients } from '../../repository/ingredient.js';
import { fetchDays } from '../../repository/meal.js';

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate: number; toDate: number } }>;

export default async (request: GetMealsRequest, reply: FastifyReply) => {
  const fromDate = new Date(request.query.fromDate);
  const toDate = new Date(request.query.toDate);

  const days = await fetchDays(fromDate, toDate);
  const ingredients = await fetchIngredients();

  const template = await new DayList(days, ingredients, { swap: false }).render();
  return reply.type('text/html').send(template);
};