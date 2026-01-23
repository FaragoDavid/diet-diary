import { FastifyReply, FastifyRequest } from 'fastify';

import { dayMealDishList } from '../../components/meals/day-meal-dish-list';
import { dayStats } from '../../components/meals/day-stats';
import { MealType } from '../../config';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import { mealStats } from '../../components/meals/meal-stats';
import * as mealService from '../../services/meal.service';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';

type UpdateDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType; dishId: string }; Body: { amount: string } }>;

export default async (request: UpdateDishRequest, reply: FastifyReply) => {
  const { mealType, dishId } = request.params;
  const date = paramToDate(request.params.date);
  const { amount } = request.body;

  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid amount. Must be a positive number.</div>');
  }

  const { day, meal } = await mealService.updateDishAmount(dishId, amountNum, date, mealType);
  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = `
    ${await dayStats(day, { layout: 'vertical', span: 'col-span-5', swapOob: HTMX_SWAP.ReplaceElement })}
    ${await mealStats(meal, { layout: 'horizontal', swapOob: HTMX_SWAP.ReplaceElement })}
    ${await dayMealDishList(meal, date, ingredients, recipes, { swapOob: false })}
  `;
  return template;
};
