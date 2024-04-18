import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../components/layout.js';
import { Recipes } from '../components/recipes/index.js';
import { NewRecipe } from '../components/recipes/new-recipe.js';
import { RecipeList } from '../components/recipes/recipe-list.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import { Recipe } from '../pages/recipe.js';
import { fetchIngredients } from '../repository/ingredient.js';
import * as recipeRepository from '../repository/recipe.js';

type GetRecipesRequest = FastifyRequest<{ Querystring: { query: string } }>;
type GetRecipeRequest = FastifyRequest<{ Params: { recipeId: string } }>;
type PostRecipeRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { newIngredient: string[] } & Record<string, string> }>;
type UpdateRecipeIngredientRequest = FastifyRequest<{
  Params: { recipeId: string; ingredientId: string };
  Body: { newIngredient: string[] } & Record<string, string>;
}>;
type DeleteRecipeIngredientRequest = UpdateRecipeIngredientRequest;
type UpdateRecipeAmountRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { amount: string; query: string } }>;
type CreateRecipeRequest = FastifyRequest<{ Body: { name: string; ingredient: string; amount: string } }>;


export const displayRecipesTab = async (_: FastifyRequest, reply: FastifyReply) => {
  const template = `${await new Recipes().render()}${tabList(TAB_NAME.recipes)}`;

  return reply.type('text/html').send(template);
};

export const getRecipes = async (request: GetRecipesRequest, reply: FastifyReply) => {
  const template = await layout(new RecipeList(request.query.query));
  return reply.type('text/html').send(template);
};

export const editRecipe = async (request: GetRecipeRequest, reply: FastifyReply) => {
  const template = await layout(new Recipe(request.params.recipeId));
  return reply.type('text/html').send(template);
};

export const addRecipeIngredient = async (request: PostRecipeRequest, reply: FastifyReply) => {
  const recipeId = request.params.recipeId;

  const recipe = await recipeRepository.fetchRecipe(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const { newIngredient } = request.body;
  if (!newIngredient[0] || !newIngredient[1]) throw new Error('New ingredient not found');

  await recipeRepository.addRecipeIngredient(recipeId, newIngredient[0], Number(newIngredient[1]));

  const template = await layout(new Recipe(recipeId));
  return reply.type('text/html').send(template);
};

export const updateRecipeIngredientAmount = async (request: UpdateRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;

  const recipe = await recipeRepository.fetchRecipe(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const ingredient = recipe.ingredients.find((ingredient) => ingredient.id === ingredientId);
  if (!ingredient) throw new Error('Ingredient not found in recipe');

  await recipeRepository.updateRecipeIngredientAmount(recipeId, ingredientId, Number(request.body[ingredientId]));

  const template = await layout(new Recipe(recipeId));
  return reply.type('text/html').send(template);
};

export const deleteRecipeIngredient = async (request: DeleteRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;

  const recipe = await recipeRepository.fetchRecipe(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const ingredient = recipe.ingredients.find((ingredient) => ingredient.id === ingredientId);
  if (!ingredient) throw new Error('Ingredient not found in recipe');

  await recipeRepository.deleteRecipeIngredient(recipeId, ingredientId);

  const template = await layout(new Recipe(recipeId));
  return reply.type('text/html').send(template);
};

export const updateRecipeAmount = (bodyType: 'list' | 'detail') => {
  const bodyTypeMap = { list: RecipeList, detail: Recipe };
  return async (request: UpdateRecipeAmountRequest, reply: FastifyReply) => {
    const recipeId = request.params.recipeId;
    const recipe = await recipeRepository.fetchRecipe(recipeId);
    if (!recipe) throw new Error('Recipe not found');

    await recipeRepository.updateRecipeAmount(recipeId, Number(request.body.amount));

    const template = await layout(new bodyTypeMap[bodyType](request.body.query));
    return reply.type('text/html').send(template);
  };
};

export const newRecipe = async (_: FastifyRequest, reply: FastifyReply) => {
  const ingredients = await fetchIngredients();

  const template = await layout(new NewRecipe(ingredients));
  return reply.type('text/html').send(template);
};

export const createRecipe = async (request: CreateRecipeRequest, reply: FastifyReply) => {
  const { name, ingredient, amount } = request.body;

  const recipeId = await recipeRepository.addRecipe(name, { id: ingredient, amount: Number(amount) });

  const template = await layout(new Recipe(recipeId));
  return reply.type('text/html').header('HX-Push-Url', `/recipe/${recipeId}`).send(template);
};