import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout.js';
import { DayPage } from '../../pages/day.js';
import { fetchIngredients } from '../../repository/ingredient.js';
import { fetchDay } from '../../repository/meal.js';
import { paramToDate } from '../../utils/converters.js';

type GetDayRequest = FastifyRequest<{ Params: { date: string } }>;

export default async (request: GetDayRequest, reply: FastifyReply) => {
  const { date } = request.params;
  const day = await fetchDay(paramToDate(date));
  if (!day) return reply.status(404).send('Day not found');

  const ingredients = await fetchIngredients();

  const template = await layout(new DayPage(day, ingredients));

  return reply.type('text/html').send(template);
};