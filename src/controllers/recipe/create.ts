import { FastifyReply, FastifyRequest } from 'fastify';

import { recipeDetails } from '../../components/recipes/recipe-details';
import { recipeHeader } from '../../components/recipes/recipe-header';
import { recipeIngredientList } from '../../components/recipes/recipe-ingredient-list';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';

type CreateRecipeRequest = FastifyRequest<{ Body: { recipeName: string } }>;

export default async (request: CreateRecipeRequest, reply: FastifyReply) => {
  const recipeName = (request.body.recipeName || '').trim();

  if (!recipeName || recipeName.length === 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Recipe name is required</div>');
  }

  const recipe = await recipeRepository.createRecipe(recipeName);
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${recipeHeader(recipe)}
    ${await recipeDetails(recipe, { swapOob: false })}
    ${await recipeIngredientList(recipe, ingredients, { layout: 'page', swapOob: false })}
  `;
  return { template, url: `/recipe/${recipe.id}` };
};
