import { FastifyReply, FastifyRequest } from 'fastify';

import { dayHeader } from '../../components/meals/day-header';
import { DayMealList } from '../../components/meals/day-meal-list';
import { DayStats } from '../../components/meals/day-stats';
import { MissingMeals } from '../../components/meals/missing-meals';
import { mealService } from '../../services/meal.service';

type DashDate = `${string}-${string}-${string}`;
type CreateDayRequest = FastifyRequest<{ Body: { date: DashDate } }>;

export default async (request: CreateDayRequest, reply: FastifyReply) => {
  const { date } = request.body;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid date format. Expected YYYY-MM-DD</div>');
  }

  const bodyDate = new Date(date);

  if (isNaN(bodyDate.getTime())) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid date value</div>');
  }

  const { day, ingredients, recipes } = await mealService.createNewDay(bodyDate);

  const template = `
    ${dayHeader(day)}
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: false }).render()}
    ${await new MissingMeals(day, { swapOob: false }).render()}
    ${await new DayMealList(day, ingredients, recipes, { layout: 'page', swapOob: false }).render()}
  `;

  const dateParam = request.body.date.split('-').join('');
  return reply.type('text/html').header('HX-Push-Url', `/day/${dateParam}`).send(template);
};
