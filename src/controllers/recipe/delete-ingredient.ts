import { FastifyReply, FastifyRequest } from 'fastify';

import { IngredientSelector } from '../../components/recipes/ingredient-selector';
import { RecipeDetails } from '../../components/recipes/recipe-details';
import { RecipeIngredientList } from '../../components/recipes/recipe-ingredient-list';
import { HTMX_SWAP } from '../../utils/htmx';
import * as recipeService from '../../services/recipe.service';
import * as ingredientRepository from '../../repository/ingredient';

type DeleteRecipeIngredientRequest = FastifyRequest<{ Params: { recipeId: string; ingredientId: string } }>;

export default async (request: DeleteRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;

  const recipe = await recipeService.removeIngredientFromRecipe(recipeId, ingredientId);
  const recipeIngredientIds = recipe.ingredients.map(({ ingredient }) => ingredient.id);
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${await new RecipeIngredientList(recipe, ingredients, { layout: 'list', swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new RecipeDetails(recipe, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new IngredientSelector(recipeIngredientIds, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};
