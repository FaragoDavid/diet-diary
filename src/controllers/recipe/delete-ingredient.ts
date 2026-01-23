import { FastifyReply, FastifyRequest } from 'fastify';

import { ingredientSelector } from '../../components/recipes/ingredient-selector';
import { recipeDetails } from '../../components/recipes/recipe-details';
import { recipeIngredientList } from '../../components/recipes/recipe-ingredient-list';
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
    ${await recipeIngredientList(recipe, ingredients, { layout: 'list', swapOob: HTMX_SWAP.ReplaceElement })}
    ${await recipeDetails(recipe, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await ingredientSelector(recipeIngredientIds, ingredients, { swapOob: HTMX_SWAP.ReplaceElement })}
  `;

  return reply.type('text/html').send(template);
};
