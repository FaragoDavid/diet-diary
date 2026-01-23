import { FastifyReply, FastifyRequest } from 'fastify';

import { ingredientDetails } from '../../components/ingredients/ingredient-details';
import { ingredientHeader } from '../../components/ingredients/ingredient-header';
import * as ingredientRepository from '../../repository/ingredient';

type CreateIngredientRequest = FastifyRequest<{ Body: { ingredientName: string } }>;

export default async (request: CreateIngredientRequest, reply: FastifyReply) => {
  const ingredientName = (request.body.ingredientName || '').trim();

  if (!ingredientName || ingredientName.length === 0) {
    return { error: 'Ingredient name is required' };
  }

  const ingredient = await ingredientRepository.insertIngredient(ingredientName);

  const template = `
    ${ingredientHeader(ingredient)}
    ${await ingredientDetails(ingredient)}
  `;

  return { template, url: `/ingredient/${ingredient.id}` };
};
