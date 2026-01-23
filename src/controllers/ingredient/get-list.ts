import { FastifyReply, FastifyRequest } from 'fastify';

import { ingredientList } from '../../components/ingredients/ingredient-list';
import * as ingredientRepository from '../../repository/ingredient';

type GetIngredientsRequest = FastifyRequest<{ Querystring: { query: string } }>;

export default async (request: GetIngredientsRequest, reply: FastifyReply) => {
  const query = (request.query.query || '').trim();

  const ingredients = await ingredientRepository.fetchIngredients(query);

  const template = await ingredientList(ingredients, { swapOob: false });

  return reply.type('text/html').send(template);
};
