import { FastifyReply, FastifyRequest } from 'fastify';

import { RecipeDetails } from '../../components/recipes/recipe-details';
import { recipeHeader } from '../../components/recipes/recipe-header';
import { RecipeIngredientList } from '../../components/recipes/recipe-ingredient-list';
import { recipeService } from '../../services/recipe.service';

type CreateRecipeRequest = FastifyRequest<{ Body: { recipeName: string } }>;

export default async (request: CreateRecipeRequest, reply: FastifyReply) => {
  const recipeName = (request.body.recipeName || '').trim();

  if (!recipeName || recipeName.length === 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Recipe name is required</div>');
  }

  const { recipe, ingredients } = await recipeService.createNewRecipe(recipeName);

  const template = `
    ${recipeHeader(recipe)}
    ${await new RecipeDetails(recipe, { swapOob: false }).render()}
    ${await new RecipeIngredientList(recipe, ingredients, { layout: 'page', swapOob: false }).render()}
  `;
  return reply.type('text/html').header('HX-Push-Url', `/recipe/${recipe.id}`).send(template);
};
