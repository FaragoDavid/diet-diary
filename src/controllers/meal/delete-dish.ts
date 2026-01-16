import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMeal } from '../../components/meals/day-meal';
import { DayStats } from '../../components/meals/day-stats';
import { MealType } from '../../config';
import { fetchIngredients } from '../../repository/ingredient';
import { deleteDish, fetchDay, fetchMeal } from '../../repository/meal';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import { fetchRecipes } from '../../repository/recipe';

type DeleteDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType; dishId: string } }>;

export default async (request: DeleteDishRequest, reply: FastifyReply) => {
  const { date, mealType, dishId } = request.params;

  await deleteDish(dishId);
  const meal = await fetchMeal(paramToDate(date), mealType);
  if (!meal) return reply.status(404).type('text/html').send('<div class="alert alert-error">Meal not found</div>');

  const day = await fetchDay(paramToDate(date));
  if (!day) return reply.status(404).type('text/html').send('<div class="alert alert-error">Day not found</div>');

  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();

  const template = `
    ${await new DayStats(day, { layout: 'vertical', swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMeal(meal, day.date, ingredients, recipes, {
      layout: 'page',
      swapOob: HTMX_SWAP.ReplaceElement,
    }).render()}
  `;

  return reply.type('text/html').send(template);
};
