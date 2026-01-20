import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout';
import { TAB_NAME } from '../../components/tab-list';
import { Dashboard } from '../../pages/dashboard';
import { ingredientService } from '../../services/ingredient.service';
import { mealService } from '../../services/meal.service';
import { recipeService } from '../../services/recipe.service';

type GetDashboardRequest = FastifyRequest<{ Params: { target: `${TAB_NAME}` } }>;

export default async (request: GetDashboardRequest, reply: FastifyReply) => {
  const { target } = request.params;

  const [ingredients, { recipes }, { days }] = await Promise.all([
    ingredientService.getAllIngredients(),
    recipeService.getAllRecipesWithIngredients(''),
    mealService.getAllDays(),
  ]);

  const template = await layout(new Dashboard(target, ingredients, recipes, days));
  return reply.type('text/html').send(template);
};
