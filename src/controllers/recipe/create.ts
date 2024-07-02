import { FastifyReply, FastifyRequest } from 'fastify';

import { RecipeDetails } from '../../components/recipes/recipe-details';
import { recipeHeader } from '../../components/recipes/recipe-header';
import { RecipeIngredientList } from '../../components/recipes/recipe-ingredient-list';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';

type CreateRecipeRequest = FastifyRequest<{ Body: { recipeName: string } }>;

export default async (request: CreateRecipeRequest, reply: FastifyReply) => {
  const { recipeName } = request.body;

  const recipe = await recipeRepository.createRecipe(recipeName);
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${recipeHeader(recipe)}
    ${await new RecipeDetails(recipe, { swapOob: false }).render()}
    ${await new RecipeIngredientList(recipe, ingredients, { layout: 'page', swapOob: false }).render()}
  `;
  return reply.type('text/html').header('HX-Push-Url', `/recipe/${recipe.id}`).send(template);
};
