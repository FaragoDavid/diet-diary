import { FastifyReply, FastifyRequest } from 'fastify';

import { RecipeList } from '../../components/recipes/recipe-list';
import { HTMX_SWAP } from '../../utils/htmx';
import { recipeService } from '../../services/recipe.service';

type DeleteRecipeRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { query: string } }>;

export default async (request: DeleteRecipeRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;
  const query = (request.body.query || '').trim();

  const { recipes, ingredients } = await recipeService.removeRecipe(recipeId, query);

  const template = await new RecipeList(recipes, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render();

  return reply.type('text/html').send(template);
};
