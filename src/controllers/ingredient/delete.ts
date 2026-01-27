import { FastifyReply, FastifyRequest } from 'fastify';

import { ingredientList } from '../../components/ingredients/ingredient-list';
import { HTMX_SWAP } from '../../utils/htmx';
import * as ingredientService from '../../services/ingredient.service';

type DeleteIngredientRequest = FastifyRequest<{ Params: { ingredientId: string }; Body: { query: string } }>;

export default async (request: DeleteIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;
  const query = (request.body.query || '').trim();

  if (!ingredientId) {
    return { error: 'Ingredient ID is required' };
  }

  try {
    const ingredients = await ingredientService.removeIngredient(ingredientId, query);
    const template = await ingredientList(ingredients, { swapOob: HTMX_SWAP.ReplaceElement });
    return template;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cannot delete ingredient')) {
      return { error: error.message };
    }
    throw error;
  }
};
