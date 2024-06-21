import { FastifyReply, FastifyRequest } from 'fastify';

import { RecipeList } from '../../components/recipes/recipe-list.js';
import * as ingredientRepository from '../../repository/ingredient.js';
import * as recipeRepository from '../../repository/recipe.js';

type GetRecipeListRequest = FastifyRequest<{ Querystring: { query: string } }>;

export default async (request: GetRecipeListRequest, reply: FastifyReply) => {
  const query = request.query.query || '';
  const recipes = await recipeRepository.fetchRecipes(query);
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = await new RecipeList(recipes, ingredients, { swapOob: false }).render();
  return reply.type('text/html').send(template);
};
