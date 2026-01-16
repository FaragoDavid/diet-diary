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

  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid amount. Must be a positive number.</div>');
  }

  await updateDish(dishId, amountNum);
  const day = await fetchDay(date);
  if (!day) return reply.status(404).type('text/html').send('<div class="alert alert-error">Day not found</div>');
  const meal = await fetchMeal(date, mealType);
  if (!meal) return reply.status(404).type('text/html').send('<div class="alert alert-error">Meal not found</div>');

  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();

  const template = `
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MealStats(meal, { layout: 'horizontal', swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMealDishList(meal, date, ingredients, recipes, { swapOob: false }).render()}
  `;
  return reply.type('text/html').send(template);
};
