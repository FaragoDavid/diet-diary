import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout';
import { IngredientPage } from '../../pages/ingredient';
import * as ingredientRepository from '../../repository/ingredient';

type GetIngredientRequest = FastifyRequest<{ Params: { ingredientId: string } }>;

export default async (request: GetIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;

  const ingredient = await ingredientRepository.fetchIngredient(ingredientId);
  if (!ingredient) {
    return reply.status(404).type('text/html').send('<div class="alert alert-error">Ingredient not found</div>');
  }

  const template = await layout(new IngredientPage(ingredient));

  return reply.type('text/html').send(template);
};
