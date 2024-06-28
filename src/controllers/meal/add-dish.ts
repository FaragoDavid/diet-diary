import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMealDish, DayMealDishHeader } from '../../components/meals/day-meal-dish';
import { DayStats } from '../../components/meals/day-stats';
import { MealStats } from '../../components/meals/meal-stats';
import { NewDish } from '../../components/meals/new-dish';
import { MealType } from '../../config';
import { fetchIngredients } from '../../repository/ingredient';
import { fetchDay, fetchMeal, addDish } from '../../repository/meal';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import { fetchRecipes } from '../../repository/recipe';

type AddDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType }; Body: { dishId: string; amount: number } }>;

export default async (request: AddDishRequest, reply: FastifyReply) => {
  const { date, mealType } = request.params;

  const dish = await addDish(paramToDate(date), mealType, request.body[`${mealType}-dishId`], Number(request.body.amount));
  const day = await fetchDay(paramToDate(date));
  if (!day) return reply.status(404).send('Day not found');

  const meal = await fetchMeal(paramToDate(date), mealType);
  if (!meal) return reply.status(404).send('Meal not found');

  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();

  const template = `
    ${
      meal.dishes.length === 1
        ? await new DayMealDishHeader(day.date, meal.type as MealType, { swapOob: HTMX_SWAP.BeforeFirstChild }).render()
        : ''
    }
    ${await new NewDish(meal, day.date, ingredients, recipes, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMealDish(dish, day.date, mealType, { swapOob: HTMX_SWAP.BeforeElement }).render()}
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MealStats(meal, { layout: 'horizontal', swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};