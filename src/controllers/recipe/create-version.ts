import { FastifyReply, FastifyRequest } from 'fastify';

import { recipeDetails } from '../../components/recipes/recipe-details';
import { recipeHeader } from '../../components/recipes/recipe-header';
import { recipeIngredientList } from '../../components/recipes/recipe-ingredient-list';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';

type CreateRecipeVersionRequest = FastifyRequest<{
  Params: { recipeId: string };
  Body: { versionName: string };
}>;

export default async (request: CreateRecipeVersionRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;
  const versionName = (request.body.versionName || '').trim();

  if (!versionName || versionName.length === 0) {
    return { error: 'Version name is required' };
  }

  const version = await recipeRepository.createRecipeVersion(recipeId, versionName);
  const ingredients = await ingredientRepository.fetchIngredients();

  if (!version) {
    return { error: 'Failed to create recipe version' };
  }

  const template = `
    ${recipeHeader(version)}
    ${await recipeDetails(version, { swapOob: false })}
    ${await recipeIngredientList(version, ingredients, { layout: 'page', swapOob: false })}
  `;
  return { template, url: `/recipe/${version.id}` };
};
