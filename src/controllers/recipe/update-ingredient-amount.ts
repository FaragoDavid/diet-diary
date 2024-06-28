import { FastifyReply, FastifyRequest } from 'fastify';

import { RecipeDetails } from '../../components/recipes/recipe-details';
import * as recipeRepository from '../../repository/recipe';
import { HTMX_SWAP } from '../../utils/htmx';

type UpdateRecipeIngredientRequest = FastifyRequest<{ Params: { recipeId: string; ingredientId: string }; Body: { amount: string } }>;

export default async (request: UpdateRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;
  const { amount } = request.body;

  const recipe = await recipeRepository.updateIngredientAmount(recipeId, ingredientId, Number(amount));
  if (!recipe) {
    return reply.status(404).send('Recipe not found');
  }

  const template = await new RecipeDetails(recipe, { swapOob: HTMX_SWAP.ReplaceElement }).render();

  return reply.type('text/html').send(template);
};
