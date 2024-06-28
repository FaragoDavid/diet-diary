import { FastifyReply, FastifyRequest } from 'fastify';

import { RecipeList } from '../../components/recipes/recipe-list';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';

type GetRecipeListRequest = FastifyRequest<{ Querystring: { query: string } }>;

export default async (request: GetRecipeListRequest, reply: FastifyReply) => {
  const query = request.query.query || '';
  const recipes = await recipeRepository.fetchRecipes(query);
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = await new RecipeList(recipes, ingredients, { swapOob: false }).render();
  return reply.type('text/html').send(template);
};
