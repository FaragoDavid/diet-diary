import { FastifyReply, FastifyRequest } from 'fastify';

import { NewRecipeIngredient } from '../../../components/recipes/new-recipe-ingredient.js';
import { RecipeDetails } from '../../../components/recipes/recipe-details.js';
import { RecipeIngredientListItem } from '../../../components/recipes/recipe-ingredient-list-item.js';
import * as ingredientRepository from '../../../repository/ingredient.js';
import * as recipeRepository from '../../../repository/recipe.js';
import { HTMX_SWAP } from '../../../utils/htmx.js';

type AddRecipeIngredientRequest = FastifyRequest<{
  Params: { recipeId: string };
  Body: { amount: string; ingredientId: string } & Record<string, string>;
}>;

export default async (request: AddRecipeIngredientRequest, reply: FastifyReply) => {
  const recipeId = request.params.recipeId;
  const { ingredientId, amount } = request.body;

  const { amount: ingredientAmount, ingredient } = await recipeRepository.addIngredient(recipeId, ingredientId, Number(amount));
  const ingredients = await ingredientRepository.fetchIngredients();
  const recipe = await recipeRepository.fetchRecipe(recipeId);
  if (!recipe) {
    return reply.status(404).send('Recipe not found');
  }

  const template = `
    ${await new RecipeIngredientListItem(ingredientAmount, ingredient, recipeId, { isFirst: recipe.ingredients.length === 1 }).render()}
    ${await new RecipeDetails(recipe, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new NewRecipeIngredient(recipe, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};
