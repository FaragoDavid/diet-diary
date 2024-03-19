import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../components/layout.js';
import { RecipeIngredientList } from '../components/recipes/recipe-ingredient-list.js';
import { RecipeList } from '../components/recipes/recipe-list.js';
import { Recipe } from '../components/recipes/recipe.js';
import repository from '../repository.js';

type GetRecipesRequest = FastifyRequest<{ Querystring: { query: string } }>;
type GetRecipeRequest = FastifyRequest<{ Params: { recipeId: string } }>;
type PostRecipeRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { newIngredient: string[] } & Record<string, string> }>;

export const getRecipe = async (request: FastifyRequest, reply: FastifyReply) => {
  const template = await layout(new Recipe());
  return reply.type('text/html').send(template);
};

export const getRecipes = async (request: GetRecipesRequest, reply: FastifyReply) => {
  const template = await layout(new RecipeList(request.query.query));
  return reply.type('text/html').send(template);
};

export const getRecipeById = async (request: GetRecipeRequest, reply: FastifyReply) => {
  const template = await layout(new Recipe(request.params.recipeId));
  return reply.type('text/html').send(template);
};

export const updateRecipe = async (request: PostRecipeRequest, reply: FastifyReply) => {
  const recipeId = request.params.recipeId;

  const recipe = await repository.fetchRecipe(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const { newIngredient, ...ingredients } = request.body;
  if (!newIngredient) throw new Error('New ingredient not found');
  if (!newIngredient[0] || !newIngredient[1]) throw new Error('New ingredient not found');

  await repository.updateRecipe(recipeId, [
    ...recipe.ingredients.map((ingredient) => ({ id: ingredient.id, amount: Number(ingredients[String(ingredient.id)]) })),
    { id: newIngredient[0], amount: Number(newIngredient[1]) },
  ]);

  const template = await layout(new RecipeIngredientList(recipeId));
  return reply.type('text/html').send(template);
};
