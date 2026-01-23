import { FastifyReply, FastifyRequest } from 'fastify';

import { newRecipeIngredient } from '../../components/recipes/new-recipe-ingredient';
import { recipeDetails } from '../../components/recipes/recipe-details';
import { recipeIngredientListItem } from '../../components/recipes/recipe-ingredient-list-item';
import { HTMX_SWAP } from '../../utils/htmx';
import * as recipeService from '../../services/recipe.service';
import * as ingredientRepository from '../../repository/ingredient';

type AddRecipeIngredientRequest = FastifyRequest<{
  Params: { recipeId: string };
  Body: { amount: string; ingredientId: string } & Record<string, string>;
}>;

export default async (request: AddRecipeIngredientRequest, reply: FastifyReply) => {
  const recipeId = request.params.recipeId;
  const { ingredientId, amount } = request.body;

  if (!ingredientId) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Please select an ingredient</div>');
  }

  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid amount. Must be a positive number.</div>');
  }

  const { ingredientAmount, ingredient, recipe } = await recipeService.addIngredientToRecipe(recipeId, ingredientId, amountNum);

  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${await recipeIngredientListItem(ingredientAmount, ingredient, recipeId, { isFirst: recipe.ingredients.length === 1 })}
    ${await recipeDetails(recipe, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await newRecipeIngredient(recipe, ingredients, { swapOob: HTMX_SWAP.ReplaceElement })}
  `;

  return template;
};
