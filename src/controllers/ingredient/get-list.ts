import { FastifyReply, FastifyRequest } from 'fastify';

import { IngredientList } from '../../components/ingredients/ingredient-list.js';
import * as ingredientRepository from '../../repository/ingredient.js';

type GetIngredientsRequest = FastifyRequest<{ Querystring: { query: string } }>;

export default async (request: GetIngredientsRequest, reply: FastifyReply) => {
  const { query } = request.query;

  const ingredients = await ingredientRepository.fetchIngredients(query);

  const template = await new IngredientList(ingredients, { swapOob: false }).render();

  return reply.type('text/html').send(template);
};
