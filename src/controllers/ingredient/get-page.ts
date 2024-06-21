import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout.js';
import { IngredientPage } from '../../pages/ingredient.js';
import * as ingredientRepository from '../../repository/ingredient.js';

type GetIngredientRequest = FastifyRequest<{ Params: { ingredientId: string } }>;

export default async (request: GetIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;

  const ingredient = await ingredientRepository.fetchIngredient(ingredientId);
  if (!ingredient) {
    return reply.status(404).send('Ingredient not found');
  }

  const template = await layout(new IngredientPage(ingredient));

  return reply.type('text/html').send(template);
};
