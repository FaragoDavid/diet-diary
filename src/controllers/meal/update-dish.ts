import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMealDishList } from '../../components/meals/day-meal-dish-list';
import { DayStats } from '../../components/meals/day-stats';
import { MealType } from '../../config';
import { fetchIngredients } from '../../repository/ingredient';
import { fetchDay, fetchMeal, updateDish } from '../../repository/meal';
import { fetchRecipes } from '../../repository/recipe';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import { MealStats } from '../../components/meals/meal-stats';

type UpdateDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType; dishId: string }; Body: { amount: string } }>;

export default async (request: UpdateDishRequest, reply: FastifyReply) => {
  const { mealType, dishId } = request.params;
  const date = paramToDate(request.params.date);
  const { amount } = request.body;

  await updateDish(dishId, Number(amount));
  const day = await fetchDay(date);
  if (!day) return reply.status(404).send('Day not found');
  const meal = await fetchMeal(date, mealType);
  if (!meal) return reply.status(404).send('Meal not found');

  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();

  const template = `
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MealStats(meal, { layout: 'horizontal', swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMealDishList(meal, date, ingredients, recipes, { swapOob: false }).render()}
  `;
  return reply.type('text/html').send(template);
};
