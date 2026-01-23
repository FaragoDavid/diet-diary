import { FastifyReply, FastifyRequest } from 'fastify';

import { RecipeDetails } from '../../components/recipes/recipe-details';
import { HTMX_SWAP } from '../../utils/htmx';
import * as recipeService from '../../services/recipe.service';

type UpdateRecipeIngredientRequest = FastifyRequest<{ Params: { recipeId: string; ingredientId: string }; Body: { amount: string } }>;

export default async (request: UpdateRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;
  const { amount } = request.body;

  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid amount. Must be a positive number.</div>');
  }

  const recipe = await recipeService.updateRecipeIngredientAmount(recipeId, ingredientId, amountNum);
  if (!recipe) {
    return reply.status(404).type('text/html').send('<div class="alert alert-error">Recipe not found</div>');
  }

  const template = await new RecipeDetails(recipe, { swapOob: HTMX_SWAP.ReplaceElement }).render();

  return reply.type('text/html').send(template);
};
