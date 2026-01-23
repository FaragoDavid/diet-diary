import { FastifyReply, FastifyRequest } from 'fastify';

import { recipeList } from '../../components/recipes/recipe-list';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';

type GetRecipeListRequest = FastifyRequest<{ Querystring: { query: string } }>;

export default async (request: GetRecipeListRequest, reply: FastifyReply) => {
  const query = (request.query.query || '').trim();
  const recipes = await recipeRepository.fetchRecipes(query);
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = await recipeList(recipes, ingredients, { swapOob: false });
  return reply.type('text/html').send(template);
};
