import { FastifyReply, FastifyRequest } from 'fastify';

import { dayMeal } from '../../components/meals/day-meal';
import { dayStats } from '../../components/meals/day-stats';
import { MealType } from '../../config';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import * as mealService from '../../services/meal.service';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';
type DeleteDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType; dishId: string } }>;

export default async (request: DeleteDishRequest, reply: FastifyReply) => {
  const { date, mealType, dishId } = request.params;

  const { meal, day } = await mealService.removeDish(dishId, paramToDate(date), mealType);
  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = `
    ${await dayStats(day, { layout: 'vertical', swapOob: HTMX_SWAP.ReplaceElement })}
    ${await dayMeal(meal, day.date, ingredients, recipes, {
      layout: 'page',
      swapOob: HTMX_SWAP.ReplaceElement,
    })}
  `;

  return reply.type('text/html').send(template);
};
