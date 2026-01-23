import { FastifyReply, FastifyRequest } from 'fastify';

import { dayList } from '../../components/meals/day-list';
import * as ingredientRepository from '../../repository/ingredient';
import * as mealRepository from '../../repository/meal';
import * as recipeRepository from '../../repository/recipe';

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate?: number; toDate?: number } }>;

export default async (request: GetMealsRequest, reply: FastifyReply) => {
  const { fromDate, toDate } = request.query;

  const days = await mealRepository.fetchDays({
    ...(fromDate && { fromDate: new Date(fromDate) }),
    ...(toDate && { toDate: new Date(toDate) }),
  });

  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = await dayList(days, ingredients, recipes, { swap: false });
  return reply.type('text/html').send(template);
};
