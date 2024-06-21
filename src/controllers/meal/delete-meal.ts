import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMealList } from '../../components/meals/day-meal-list.js';
import { DayStats } from '../../components/meals/day-stats.js';
import { MissingMeals } from '../../components/meals/missing-meals.js';
import { MealType } from '../../config.js';
import { deleteMeal, fetchDay } from '../../repository/meal.js';
import { paramToDate } from '../../utils/converters.js';
import { HTMX_SWAP } from '../../utils/htmx.js';

type DeleteMealRequest = FastifyRequest<{ Params: { date: string; mealType: MealType } }>;

export default async (request: DeleteMealRequest, reply: FastifyReply) => {
  const date = paramToDate(request.params.date);
  const mealType = request.params.mealType;

  await deleteMeal(date, mealType);
  const day = await fetchDay(date);
  if (!day) return reply.status(404).send('Day not found');

  const template = `
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MissingMeals(day, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMealList(day, [], { layout: 'page', swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;
  return reply.type('text/html').send(template);
};