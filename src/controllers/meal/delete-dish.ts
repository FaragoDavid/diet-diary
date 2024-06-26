import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMeal } from '../../components/meals/day-meal.js';
import { DayStats } from '../../components/meals/day-stats.js';
import { MealType } from '../../config.js';
import { fetchIngredients } from '../../repository/ingredient.js';
import { deleteDish, fetchDay, fetchMeal } from '../../repository/meal.js';
import { paramToDate } from '../../utils/converters.js';
import { HTMX_SWAP } from '../../utils/htmx.js';
import { fetchRecipes } from '../../repository/recipe.js';

type DeleteDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType; dishId: string } }>;

export default async (request: DeleteDishRequest, reply: FastifyReply) => {
  const { date, mealType, dishId } = request.params;

  await deleteDish(dishId);
  const meal = await fetchMeal(paramToDate(date), mealType);
  if (!meal) return reply.status(404).send('Meal not found');

  const day = await fetchDay(paramToDate(date));
  if (!day) return reply.status(404).send('Day not found');

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