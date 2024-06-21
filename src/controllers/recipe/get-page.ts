import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout.js';
import { RecipePage } from '../../pages/recipe.js';
import * as ingredientRepository from '../../repository/ingredient.js';
import * as recipeRepository from '../../repository/recipe.js';

type GetRecipeRequest = FastifyRequest<{ Params: { recipeId: string } }>;

export default async (request: GetRecipeRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;

  const recipe = await recipeRepository.fetchRecipe(recipeId);
  if (!recipe) {
    return reply.status(404).send('Recipe not found');
  }
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = await layout(new RecipePage(recipe, ingredients));

  return reply.type('text/html').send(template);
};
