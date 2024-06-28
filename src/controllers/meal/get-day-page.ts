import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout';
import { DayPage } from '../../pages/day';
import { fetchIngredients } from '../../repository/ingredient';
import { fetchDay } from '../../repository/meal';
import { paramToDate } from '../../utils/converters';
import { fetchRecipes } from '../../repository/recipe';

type GetDayRequest = FastifyRequest<{ Params: { date: string } }>;

export default async (request: GetDayRequest, reply: FastifyReply) => {
  const { date } = request.params;
  const day = await fetchDay(paramToDate(date));
  if (!day) return reply.status(404).send('Day not found');

  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();

  const template = await layout(new DayPage(day, ingredients, recipes));

  return reply.type('text/html').send(template);
};