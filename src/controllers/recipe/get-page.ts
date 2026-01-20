import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout';
import { RecipePage } from '../../pages/recipe';
import { recipeService } from '../../services/recipe.service';

type GetRecipeRequest = FastifyRequest<{ Params: { recipeId: string } }>;

export default async (request: GetRecipeRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;

  const result = await recipeService.getRecipeWithIngredients(recipeId);
  if (!result) {
    return reply.status(404).type('text/html').send('<div class="alert alert-error">Recipe not found</div>');
  }

  const { recipe, ingredients } = result;

  const template = await layout(new RecipePage(recipe, ingredients));

  return reply.type('text/html').send(template);
};
