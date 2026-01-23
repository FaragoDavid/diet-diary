import { FastifyReply, FastifyRequest } from 'fastify';

import { dayMealList } from '../../components/meals/day-meal-list';
import { dayStats } from '../../components/meals/day-stats';
import { missingMeals } from '../../components/meals/missing-meals';
import { MealType } from '../../config';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import * as mealService from '../../services/meal.service';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';

type DeleteMealRequest = FastifyRequest<{ Params: { date: string; mealType: MealType } }>;

export default async (request: DeleteMealRequest, reply: FastifyReply) => {
  const date = paramToDate(request.params.date);
  const mealType = request.params.mealType;

  const day = await mealService.removeMeal(date, mealType);
  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = `
    ${await dayStats(day, { layout: 'vertical', span: 'col-span-5', swapOob: HTMX_SWAP.ReplaceElement })}
    ${await missingMeals(day, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await dayMealList(day, ingredients, recipes, { layout: 'page', swapOob: HTMX_SWAP.ReplaceElement })}
  `;
  return reply.type('text/html').send(template);
};
