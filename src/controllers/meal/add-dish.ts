import { FastifyReply, FastifyRequest } from 'fastify';

import { dayMealDish, dayMealDishHeader } from '../../components/meals/day-meal-dish';
import { dayStats } from '../../components/meals/day-stats';
import { mealStats } from '../../components/meals/meal-stats';
import { newDish } from '../../components/meals/new-dish';
import { MealType } from '../../config';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import * as mealService from '../../services/meal.service';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';
type AddDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType }; Body: { dishId: string; amount: number } }>;

export default async (request: AddDishRequest, reply: FastifyReply) => {
  const { date, mealType } = request.params;

  const amount = Number(request.body.amount);
  if (isNaN(amount) || amount <= 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid amount. Must be a positive number.</div>');
  }

  const dishId = request.body[`${mealType}-dishId`];
  if (!dishId) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Please select an ingredient or recipe.</div>');
  }

  const { dish, day, meal } = await mealService.addDishToMeal(paramToDate(date), mealType, dishId, amount);
  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = `
    ${meal.dishes.length === 1 ? await dayMealDishHeader(day.date, meal.type as MealType, { swapOob: HTMX_SWAP.BeforeFirstChild }) : ''}
    ${await newDish(meal, day.date, ingredients, recipes, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await dayMealDish(dish, day.date, mealType, { swapOob: HTMX_SWAP.BeforeElement })}
    ${await dayStats(day, { layout: 'vertical', span: 'col-span-5', swapOob: HTMX_SWAP.ReplaceElement })}
    ${await mealStats(meal, { layout: 'horizontal', swapOob: HTMX_SWAP.ReplaceElement })}
  `;

  return template;
};
