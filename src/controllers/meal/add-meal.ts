import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMealList } from '../../components/meals/day-meal-list';
import { MissingMeals } from '../../components/meals/missing-meals';
import { MealType } from '../../config';
import { fetchIngredients } from '../../repository/ingredient';
import { addMeal, fetchDay } from '../../repository/meal';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import { fetchRecipes } from '../../repository/recipe';

type AddMealRequest = FastifyRequest<{ Params: { date: string }; Body: { mealType: MealType } }>;

export default async (request: AddMealRequest, reply: FastifyReply) => {
  const date = paramToDate(request.params.date);

  await addMeal(date, request.body.mealType);
  const day = await fetchDay(date);
  if (!day) return reply.status(404).send('Day not found');

  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();

  const template = `
    ${await new MissingMeals(day, { swapOob: false }).render()}
    ${await new DayMealList(day, ingredients, recipes, { layout: 'page', swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};