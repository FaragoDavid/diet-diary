import { FastifyReply, FastifyRequest } from 'fastify';

import { IngredientDetails } from '../../components/ingredients/ingredient-details.js';
import { ingredientHeader } from '../../components/ingredients/ingredient-header.js';
import * as ingredientRepository from '../../repository/ingredient.js';

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