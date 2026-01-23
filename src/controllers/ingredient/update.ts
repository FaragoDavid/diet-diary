import { FastifyReply, FastifyRequest } from 'fastify';

import * as ingredientRepository from '../../repository/ingredient';

type UpdateIngredientRequest = FastifyRequest<{
  Params: { ingredientId: string };
  Body: { calories: string; carbs: string; fat: string; isVegetable: 'on' | undefined; isCarbCounted: 'on' | undefined };
}>;

export default async (request: UpdateIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;
  const { calories, carbs, fat, isVegetable } = request.body;

  const caloriesNum = calories ? parseFloat(calories) : null;
  const carbsNum = carbs ? parseFloat(carbs) : null;
  const fatNum = fat ? parseFloat(fat) : null;

  if (
    (caloriesNum !== null && (isNaN(caloriesNum) || caloriesNum < 0)) ||
    (carbsNum !== null && (isNaN(carbsNum) || carbsNum < 0)) ||
    (fatNum !== null && (isNaN(fatNum) || fatNum < 0))
  ) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid numeric values</div>');
  }

  await ingredientRepository.updateIngredient(ingredientId, {
    ...(caloriesNum !== null && { caloriesPer100: caloriesNum }),
    ...(carbsNum !== null && { carbsPer100: carbsNum }),
    ...(fatNum !== null && { fatPer100: fatNum }),
    isVegetable: isVegetable === 'on',
    isCarbCounted: request.body.isCarbCounted === 'on',
  });

  return reply.type('text/html').send();
};
