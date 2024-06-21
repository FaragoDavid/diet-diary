import { FastifyReply, FastifyRequest } from 'fastify';

import { IngredientSelector } from '../../components/recipes/ingredient-selector.js';
import { RecipeDetails } from '../../components/recipes/recipe-details.js';
import { RecipeIngredientList } from '../../components/recipes/recipe-ingredient-list.js';
import * as ingredientRepository from '../../repository/ingredient.js';
import * as recipeRepository from '../../repository/recipe.js';
import { HTMX_SWAP } from '../../utils/htmx.js';

type DeleteRecipeIngredientRequest = FastifyRequest<{ Params: { recipeId: string; ingredientId: string } }>;

export default async (request: DeleteRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;

  const recipe = await recipeRepository.deleteRecipeIngredient(recipeId, ingredientId);
  if (!recipe) {
    return reply.status(404).send('Recipe not found');
  }
  const recipeIngredientIds = recipe.ingredients.map(({ ingredient }) => ingredient.id);
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${await new RecipeIngredientList(recipe, ingredients, { layout: 'list', swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new RecipeDetails(recipe, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new IngredientSelector(recipeIngredientIds, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};
