import { FastifyReply, FastifyRequest } from 'fastify';

import { NewRecipeIngredient } from '../../components/recipes/new-recipe-ingredient';
import { RecipeDetails } from '../../components/recipes/recipe-details';
import { RecipeIngredientListItem } from '../../components/recipes/recipe-ingredient-list-item';
import { fetchIngredients } from '../../repository/ingredient';
import { fetchRecipe } from '../../repository/recipe';
import { addIngredient } from '../../repository/recipe-ingredient';
import { HTMX_SWAP } from '../../utils/htmx';

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

  const { amount: ingredientAmount, ingredient } = await addIngredient(recipeId, ingredientId, amountNum);
  const ingredients = await fetchIngredients();
  const recipe = await fetchRecipe(recipeId);
  if (!recipe) {
    return reply.status(404).type('text/html').send('<div class="alert alert-error">Recipe not found</div>');
  }

  const template = `
    ${await new RecipeIngredientListItem(ingredientAmount, ingredient, recipeId, { isFirst: recipe.ingredients.length === 1 }).render()}
    ${await new RecipeDetails(recipe, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new NewRecipeIngredient(recipe, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};
