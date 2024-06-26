import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMealDish, DayMealDishHeader } from '../../components/meals/day-meal-dish.js';
import { DayStats } from '../../components/meals/day-stats.js';
import { MealStats } from '../../components/meals/meal-stats.js';
import { NewDish } from '../../components/meals/new-dish.js';
import { MealType } from '../../config.js';
import { fetchIngredients } from '../../repository/ingredient.js';
import { fetchDay, fetchMeal, addDish } from '../../repository/meal.js';
import { paramToDate } from '../../utils/converters.js';
import { HTMX_SWAP } from '../../utils/htmx.js';

type AddDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType }; Body: { dishId: string; amount: number } }>;

export default async (request: AddDishRequest, reply: FastifyReply) => {
  const { date, mealType } = request.params;

  const dish = await addDish(paramToDate(date), mealType, request.body[`${mealType}-dishId`], Number(request.body.amount));
  const day = await fetchDay(paramToDate(date));
  if (!day) return reply.status(404).send('Day not found');

  const meal = await fetchMeal(paramToDate(date), mealType);
  if (!meal) return reply.status(404).send('Meal not found');

  const ingredients = await fetchIngredients();

  const template = `
    ${
      meal.dishes.length === 1
        ? await new DayMealDishHeader(day.date, meal.type as MealType, { swapOob: HTMX_SWAP.BeforeFirstChild }).render()
        : ''
    }
    ${await new NewDish(meal, day.date, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMealDish(dish, day.date, mealType, { swapOob: HTMX_SWAP.BeforeElement }).render()}
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MealStats(meal, { layout: 'horizontal', swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};