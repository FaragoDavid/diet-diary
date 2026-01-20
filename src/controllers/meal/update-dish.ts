import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMealDishList } from '../../components/meals/day-meal-dish-list';
import { DayStats } from '../../components/meals/day-stats';
import { MealType } from '../../config';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import { MealStats } from '../../components/meals/meal-stats';
import { mealService } from '../../services/meal.service';

type UpdateDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType; dishId: string }; Body: { amount: string } }>;

export default async (request: UpdateDishRequest, reply: FastifyReply) => {
  const { mealType, dishId } = request.params;
  const date = paramToDate(request.params.date);
  const { amount } = request.body;

  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid amount. Must be a positive number.</div>');
  }

  const { day, meal, ingredients, recipes } = await mealService.updateDishAmount(dishId, amountNum, date, mealType);

  const template = `
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MealStats(meal, { layout: 'horizontal', swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMealDishList(meal, date, ingredients, recipes, { swapOob: false }).render()}
  `;
  return reply.type('text/html').send(template);
};
