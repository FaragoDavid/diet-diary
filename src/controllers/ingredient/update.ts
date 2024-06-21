import { FastifyReply, FastifyRequest } from 'fastify';

import * as ingredientRepository from '../../repository/ingredient.js';

type UpdateIngredientRequest = FastifyRequest<{ Params: { ingredientId: string }; Body: { calories: string; carbs: string; fat: string } }>;

export default async (request: UpdateIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;
  const { calories, carbs, fat } = request.body;

  await ingredientRepository.updateIngredient(ingredientId, {
    ...(calories && { caloriesPer100: parseFloat(calories) }),
    ...(carbs && { carbsPer100: parseFloat(carbs) }),
    ...(fat && { fatPer100: parseFloat(fat) }),
  });

  return reply.type('text/html').send();
};
