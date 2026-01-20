import { FastifyReply, FastifyRequest } from 'fastify';

import { recipeService } from '../../services/recipe.service';

type UpdateRecipeAmountRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { amount: string; query: string } }>;

export default async (request: UpdateRecipeAmountRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;
  const { amount } = request.body;

  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid amount. Must be a positive number.</div>');
  }

  await recipeService.updateRecipeServingAmount(recipeId, amountNum);

  return reply.type('text/html').send();
};
