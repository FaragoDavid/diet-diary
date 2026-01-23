import { FastifyReply, FastifyRequest } from 'fastify';

import { recipeList } from '../../components/recipes/recipe-list';
import { HTMX_SWAP } from '../../utils/htmx';
import * as recipeService from '../../services/recipe.service';
import * as ingredientRepository from '../../repository/ingredient';

type DeleteRecipeRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { query: string } }>;

export default async (request: DeleteRecipeRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;
  const query = (request.body.query || '').trim();

  const recipes = await recipeService.removeRecipe(recipeId, query);
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = await recipeList(recipes, ingredients, { swapOob: HTMX_SWAP.ReplaceElement });

  return template;
};
