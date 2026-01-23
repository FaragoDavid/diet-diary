import { FastifyReply, FastifyRequest } from 'fastify';

import { dayMealList } from '../../components/meals/day-meal-list';
import { missingMeals } from '../../components/meals/missing-meals';
import { MealType } from '../../config';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import * as mealService from '../../services/meal.service';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';

type AddMealRequest = FastifyRequest<{ Params: { date: string }; Body: { mealType: MealType } }>;

export default async (request: AddMealRequest, reply: FastifyReply) => {
  const dateParam = request.params.date;
  const { mealType } = request.body;

  if (!mealType) {
    return { error: 'Meal type is required' };
  }

  const date = paramToDate(dateParam);
  const day = await mealService.addMealToDay(date, mealType);
  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = `
    ${await missingMeals(day, { swapOob: false })}
    ${await dayMealList(day, ingredients, recipes, { layout: 'page', swapOob: HTMX_SWAP.ReplaceElement })}
  `;

  return template;
};
