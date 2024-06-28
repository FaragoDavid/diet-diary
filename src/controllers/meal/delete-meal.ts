import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMealList } from '../../components/meals/day-meal-list';
import { DayStats } from '../../components/meals/day-stats';
import { MissingMeals } from '../../components/meals/missing-meals';
import { MealType } from '../../config';
import { deleteMeal, fetchDay } from '../../repository/meal';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import { fetchIngredients } from '../../repository/ingredient';
import { fetchRecipes } from '../../repository/recipe';

type DeleteMealRequest = FastifyRequest<{ Params: { date: string; mealType: MealType } }>;

export default async (request: DeleteMealRequest, reply: FastifyReply) => {
  const date = paramToDate(request.params.date);
  const mealType = request.params.mealType;

  await deleteMeal(date, mealType);
  const day = await fetchDay(date);
  if (!day) return reply.status(404).send('Day not found');

  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();

  const template = `
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MissingMeals(day, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMealList(day, ingredients, recipes, { layout: 'page', swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;
  return reply.type('text/html').send(template);
};