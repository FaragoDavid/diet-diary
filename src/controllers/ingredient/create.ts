import { FastifyReply, FastifyRequest } from 'fastify';

import { IngredientDetails } from '../../components/ingredients/ingredient-details';
import { ingredientHeader } from '../../components/ingredients/ingredient-header';
import * as ingredientRepository from '../../repository/ingredient';

type CreateIngredientRequest = FastifyRequest<{ Body: { ingredientName: string } }>;

export default async (request: CreateIngredientRequest, reply: FastifyReply) => {
  const { ingredientName } = request.body;

  const ingredient = await ingredientRepository.insertIngredient(ingredientName);

  const template = `
    ${ingredientHeader(ingredient)}
    ${await new IngredientDetails(ingredient).render()}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/recipe/${ingredient.id}`).send(template);
};