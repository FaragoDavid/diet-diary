import { FastifyReply, FastifyRequest } from 'fastify';

import { RecipeList } from '../../components/recipes/recipe-list';
import { recipeService } from '../../services/recipe.service';

type GetRecipeListRequest = FastifyRequest<{ Querystring: { query: string } }>;

export default async (request: GetRecipeListRequest, reply: FastifyReply) => {
  const query = (request.query.query || '').trim();
  const { recipes, ingredients } = await recipeService.getAllRecipesWithIngredients(query);

  const template = await new RecipeList(recipes, ingredients, { swapOob: false }).render();
  return reply.type('text/html').send(template);
};
