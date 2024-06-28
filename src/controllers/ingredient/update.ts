import { FastifyReply, FastifyRequest } from 'fastify';

import * as ingredientRepository from '../../repository/ingredient';

type UpdateIngredientRequest = FastifyRequest<{
  Params: { ingredientId: string };
  Body: { calories: string; carbs: string; fat: string; isVegetable: 'on' | undefined; isCarbCounted: 'on' | undefined };
}>;

export default async (request: UpdateIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;
  const { calories, carbs, fat, isVegetable } = request.body;

  await ingredientRepository.updateIngredient(ingredientId, {
    ...(calories && { caloriesPer100: parseFloat(calories) }),
    ...(carbs && { carbsPer100: parseFloat(carbs) }),
    ...(fat && { fatPer100: parseFloat(fat) }),
    isVegetable: isVegetable === 'on',
    isCarbCounted: request.body.isCarbCounted === 'on',
  });

  return reply.type('text/html').send();
};
