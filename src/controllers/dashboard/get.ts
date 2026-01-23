import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout';
import { TAB_NAME } from '../../components/tab-list';
import { Dashboard } from '../../pages/dashboard';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';
import * as mealRepository from '../../repository/meal';

type GetDashboardRequest = FastifyRequest<{ Params: { target: `${TAB_NAME}` } }>;

export default async (request: GetDashboardRequest, reply: FastifyReply) => {
  const { target } = request.params;

  const [ingredients, recipes, days] = await Promise.all([
    ingredientRepository.fetchIngredients(),
    recipeRepository.fetchRecipes(''),
    mealRepository.fetchDays(),
  ]);

  const template = await layout(new Dashboard(target, ingredients, recipes, days));
  return template;
};
