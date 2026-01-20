import { FastifyReply, FastifyRequest } from 'fastify';

import { DayList } from '../../components/meals/day-list';
import { mealService } from '../../services/meal.service';

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate?: number; toDate?: number } }>;

export default async (request: GetMealsRequest, reply: FastifyReply) => {
  const { fromDate, toDate } = request.query;

  const { days, ingredients, recipes } = await mealService.getAllDays({
    ...(fromDate && { fromDate: new Date(fromDate) }),
    ...(toDate && { toDate: new Date(toDate) }),
  });

  const template = await new DayList(days, ingredients, recipes, { swap: false }).render();
  return reply.type('text/html').send(template);
};
