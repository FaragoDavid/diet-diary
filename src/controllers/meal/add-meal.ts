import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMealList } from '../../components/meals/day-meal-list.js';
import { MissingMeals } from '../../components/meals/missing-meals.js';
import { MealType } from '../../config.js';
import { fetchIngredients } from '../../repository/ingredient.js';
import { addMeal, fetchDay } from '../../repository/meal.js';
import { paramToDate } from '../../utils/converters.js';
import { HTMX_SWAP } from '../../utils/htmx.js';

type AddMealRequest = FastifyRequest<{ Params: { date: string }; Body: { mealType: MealType } }>;

export default async (request: AddMealRequest, reply: FastifyReply) => {
  const date = paramToDate(request.params.date);

  const meal = await addMeal(date, request.body.mealType);
  const day = await fetchDay(date);
  if (!day) return reply.status(404).send('Day not found');

  const ingredients = await fetchIngredients();

  const template = `
    ${await new MissingMeals(day, { swapOob: false }).render()}
    ${await new DayMealList(day, ingredients, { layout: 'page', swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};