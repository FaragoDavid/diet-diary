import { FastifyReply, FastifyRequest } from 'fastify';

import { IngredientList } from '../../components/ingredients/ingredient-list';
import * as ingredientRepository from '../../repository/ingredient';
import { HTMX_SWAP } from '../../utils/htmx';

type DeleteIngredientRequest = FastifyRequest<{ Params: { ingredientId: string }; Body: { query: string } }>;

export default async (request: DeleteIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;
  const { query } = request.body;

  await ingredientRepository.deleteIngredient(ingredientId);
  let ingredients = await ingredientRepository.fetchIngredients(query);
  if (ingredients.length === 0) {
    ingredients = await ingredientRepository.fetchIngredients();
  }

  const template = await new IngredientList(ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render();

  return reply.type('text/html').send(template);
};
