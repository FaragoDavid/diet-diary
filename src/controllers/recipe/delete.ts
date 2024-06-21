import { FastifyReply, FastifyRequest } from 'fastify';

import { RecipeList } from '../../components/recipes/recipe-list.js';
import * as ingredientRepository from '../../repository/ingredient.js';
import * as recipeRepository from '../../repository/recipe.js';
import { HTMX_SWAP } from '../../utils/htmx.js';

type DeleteRecipeRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { query: string } }>;

export default async (request: DeleteRecipeRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;
  const { query } = request.body;

  await recipeRepository.deleteRecipe(recipeId);
  let recipes = await recipeRepository.fetchRecipes(query);
  if (recipes.length === 0) {
    recipes = await recipeRepository.fetchRecipes('');
  }
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = await new RecipeList(recipes, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render();

  return reply.type('text/html').send(template);
};