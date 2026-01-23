import { FastifyReply, FastifyRequest } from 'fastify';

import { ingredientList } from '../../components/ingredients/ingredient-list';
import { HTMX_SWAP } from '../../utils/htmx';
import * as ingredientService from '../../services/ingredient.service';

type DeleteIngredientRequest = FastifyRequest<{ Params: { ingredientId: string }; Body: { query: string } }>;

export default async (request: DeleteIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;
  const query = (request.body.query || '').trim();

  if (!ingredientId) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Ingredient ID is required</div>');
  }

  const ingredients = await ingredientService.removeIngredient(ingredientId, query);

  const template = await ingredientList(ingredients, { swapOob: HTMX_SWAP.ReplaceElement });

  return reply.type('text/html').send(template);
};
