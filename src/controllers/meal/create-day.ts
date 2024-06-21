import { FastifyReply, FastifyRequest } from 'fastify';

import { dayHeader } from '../../components/meals/day-header.js';
import { DayStats } from '../../components/meals/day-stats.js';
import { MissingMeals } from '../../components/meals/missing-meals.js';
import { createDay } from '../../repository/meal.js';
import { HTMX_SWAP } from '../../utils/htmx.js';

type DashDate = `${string}-${string}-${string}`;
type CreateDayRequest = FastifyRequest<{ Body: { date: DashDate } }>;

export default async (request: CreateDayRequest, reply: FastifyReply) => {
  const bodyDate = new Date(request.body.date);
  const day = await createDay(bodyDate);

  const template = `
    ${dayHeader(day)}
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MissingMeals(day, { swapOob: false }).render()}
  `;

  const dateParam = request.body.date.split('-').join('');
  return reply.type('text/html').header('HX-Push-Url', `/day/${dateParam}`).send(template);
};