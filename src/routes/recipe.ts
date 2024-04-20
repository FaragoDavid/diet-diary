import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../components/layout.js';
import { NewRecipe } from '../components/recipes/new-recipe.js';
import { RecipeList } from '../components/recipes/recipe-list.js';
import { RecipeTab } from '../components/recipes/recipe-tab.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import { RecipePage } from '../pages/recipe.js';
import { selectIngredients } from '../repository/ingredient.js';
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
  try {
    const template = `
    ${tabList(TAB_NAME.recipes, true)}
    ${await new RecipeTab().render()}
  `;

    return reply.type('text/html').send(template);
  } catch (e) {
    console.log(e);
    throw new Error('Error in displayRecipesTab');
  }
};

export const getRecipes = async (request: GetRecipesRequest, reply: FastifyReply) => {
  const query = request.query.query || '';
  const recipes = await recipeRepository.selectRecipes(query);
  const ingredients = await selectIngredients();

  const template = await new RecipeList(recipes, ingredients).render();
  return reply.type('text/html').send(template);
};

export const getRecipe = async (request: GetRecipeRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;

  const recipe = await recipeRepository.selectRecipe(recipeId);
  const ingredients = await selectIngredients();

  const template = await layout(new RecipePage(recipe, ingredients));

  return reply.type('text/html').send(template);
};

export const addRecipeIngredient = async (request: PostRecipeRequest, reply: FastifyReply) => {
  const recipeId = request.params.recipeId;

  const recipe = await recipeRepository.selectRecipe(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const { newIngredient } = request.body;
  if (!newIngredient[0] || !newIngredient[1]) throw new Error('New ingredient not found');

  await recipeRepository.insertRecipeIngredient(recipeId, newIngredient[0], Number(newIngredient[1]));

  // const template = await layout(new RecipePage(recipeId));
  // return reply.type('text/html').send(template);
  throw new Error('Not implemented');
};

export const updateRecipeIngredientAmount = async (request: UpdateRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;

  const recipe = await recipeRepository.selectRecipe(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const ingredient = recipe.ingredients.find((ingredient) => ingredient.id === ingredientId);
  if (!ingredient) throw new Error('Ingredient not found in recipe');

  await recipeRepository.updateRecipeIngredientAmount(recipeId, ingredientId, Number(request.body[ingredientId]));

  // const template = await layout(new RecipePage(recipeId));
  // return reply.type('text/html').send(template);
  throw new Error('Not implemented');
};

export const deleteRecipeIngredient = async (request: DeleteRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;

  const recipe = await recipeRepository.selectRecipe(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const ingredient = recipe.ingredients.find((ingredient) => ingredient.id === ingredientId);
  if (!ingredient) throw new Error('Ingredient not found in recipe');

  await recipeRepository.deleteRecipeIngredient(recipeId, ingredientId);

  // const template = await layout(new RecipePage(recipeId));
  // return reply.type('text/html').send(template);
  throw new Error('Not implemented');
};

export const updateRecipeAmount = (bodyType: 'list' | 'detail') => {
  const bodyTypeMap = { list: RecipeList, detail: RecipePage };
  return async (request: UpdateRecipeAmountRequest, reply: FastifyReply) => {
    const recipeId = request.params.recipeId;
    const recipe = await recipeRepository.selectRecipe(recipeId);
    if (!recipe) throw new Error('Recipe not found');

    await recipeRepository.updateRecipeAmount(recipeId, Number(request.body.amount));

    // const template = await layout(new bodyTypeMap[bodyType](request.body.query));
    // return reply.type('text/html').send(template);
    throw new Error('Not implemented');
  };
};

export const newRecipe = async (_: FastifyRequest, reply: FastifyReply) => {
  const ingredients = await selectIngredients();

  const template = await layout(new NewRecipe(ingredients));
  return reply.type('text/html').send(template);
};

export const createRecipe = async (request: CreateRecipeRequest, reply: FastifyReply) => {
  const { name, ingredient, amount } = request.body;

  // const recipeId = await recipeRepository.addRecipe(name, { id: ingredient, amount: Number(amount) });

  // const template = await layout(new RecipePage(recipeId));
  // return reply.type('text/html').header('HX-Push-Url', `/recipe/${recipeId}`).send(template);
  throw new Error('Not implemented');
};