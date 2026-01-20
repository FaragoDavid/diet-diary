import { FastifyReply, FastifyRequest } from 'fastify';

import { IngredientList } from '../../components/ingredients/ingredient-list';
import { ingredientService } from '../../services/ingredient.service';

type GetIngredientsRequest = FastifyRequest<{ Querystring: { query: string } }>;

export default async (request: GetIngredientsRequest, reply: FastifyReply) => {
  const query = (request.query.query || '').trim();

  const ingredients = await ingredientService.getAllIngredients(query);

  const template = await new IngredientList(ingredients, { swapOob: false }).render();

  return reply.type('text/html').send(template);
};
