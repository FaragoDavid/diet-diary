import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMealList } from '../../components/meals/day-meal-list';
import { DayStats } from '../../components/meals/day-stats';
import { MissingMeals } from '../../components/meals/missing-meals';
import { MealType } from '../../config';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import * as mealService from '../../services/meal.service';

type DeleteMealRequest = FastifyRequest<{ Params: { date: string; mealType: MealType } }>;

export default async (request: DeleteMealRequest, reply: FastifyReply) => {
  const date = paramToDate(request.params.date);
  const mealType = request.params.mealType;

  const day = await mealService.removeMeal(date, mealType);
  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = `
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MissingMeals(day, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMealList(day, ingredients, recipes, { layout: 'page', swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;
  return reply.type('text/html').send(template);
};
