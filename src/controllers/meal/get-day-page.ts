import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout';
import { DayPage } from '../../pages/day';
import { paramToDate } from '../../utils/converters';
import { mealService } from '../../services/meal.service';

type GetDayRequest = FastifyRequest<{ Params: { date: string } }>;

export default async (request: GetDayRequest, reply: FastifyReply) => {
  const { date } = request.params;

  const result = await mealService.getDayWithResources(paramToDate(date));
  if (!result) {
    return reply.status(404).type('text/html').send('<div class="alert alert-error">Day not found</div>');
  }

  const { day, ingredients, recipes } = result;

  const template = await layout(new DayPage(day, ingredients, recipes));

  return reply.type('text/html').send(template);
};
