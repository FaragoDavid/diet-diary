import { FastifyReply, FastifyRequest } from 'fastify';

import * as recipeRepository from '../../repository/recipe';

type UpdateRecipeAmountRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { amount: string; query: string } }>;

export default async (request: UpdateRecipeAmountRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;
  const { amount } = request.body;

  await recipeRepository.updateRecipeAmount(recipeId, Number(amount));

  return reply.type('text/html').send();
};