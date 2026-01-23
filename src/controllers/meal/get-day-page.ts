import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout';
import { DayPage } from '../../pages/day';
import { paramToDate } from '../../utils/converters';
import * as ingredientRepository from '../../repository/ingredient';
import * as mealRepository from '../../repository/meal';
import * as recipeRepository from '../../repository/recipe';

type GetDayRequest = FastifyRequest<{ Params: { date: string } }>;

export default async (request: GetDayRequest, reply: FastifyReply) => {
  const { date } = request.params;

  const day = await mealRepository.fetchDay(paramToDate(date));
  if (!day) {
    return reply.status(404).type('text/html').send('<div class="alert alert-error">Day not found</div>');
  }

  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = await layout(new DayPage(day, ingredients, recipes));

  return template;
};
