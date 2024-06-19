import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../components/layout.js';
import { IngredientSelector } from '../components/recipes/ingredient-selector.js';
import { NewRecipeIngredient } from '../components/recipes/new-recipe-ingredient.js';
import { RecipeDetails } from '../components/recipes/recipe-details.js';
import { recipeHeader } from '../components/recipes/recipe-header.js';
import { RecipeIngredientListItem } from '../components/recipes/recipe-ingredient-list-item.js';
import { RecipeIngredientList } from '../components/recipes/recipe-ingredient-list.js';
import { RecipeList } from '../components/recipes/recipe-list.js';
import { RecipeTab } from '../components/recipes/recipe-tab.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import { NewRecipePage, RecipePage } from '../pages/recipe.js';
import * as ingredientRepository from '../repository/ingredient.js';
import * as recipeRepository from '../repository/recipe.js';
import { HTMX_SWAP } from '../utils/htmx.js';

type GetRecipesRequest = FastifyRequest<{ Querystring: { query: string } }>;
type GetRecipeRequest = FastifyRequest<{ Params: { recipeId: string } }>;
type DeleteRecipeRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { query: string } }>;
type PostRecipeRequest = FastifyRequest<{
  Params: { recipeId: string };
  Body: { amount: string; ingredientId: string } & Record<string, string>;
}>;
type UpdateRecipeIngredientRequest = FastifyRequest<{ Params: { recipeId: string; ingredientId: string }; Body: { amount: string } }>;
type DeleteRecipeIngredientRequest = FastifyRequest<{ Params: { recipeId: string; ingredientId: string } }>;
type UpdateRecipeAmountRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { amount: string; query: string } }>;
type CreateRecipeRequest = FastifyRequest<{ Body: { recipeName: string } }>;

export const displayRecipesTab = async (_: FastifyRequest, reply: FastifyReply) => {
  const recipes = await recipeRepository.fetchRecipes('');
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${tabList(TAB_NAME.recipes, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await new RecipeTab(recipes, ingredients).render()}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/dashboard/${TAB_NAME.recipes}`).send(template);
};

export const getRecipes = async (request: GetRecipesRequest, reply: FastifyReply) => {
  const query = request.query.query || '';
  const recipes = await recipeRepository.fetchRecipes(query);
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = await new RecipeList(recipes, ingredients, { swap: false }).render();
  return reply.type('text/html').send(template);
};

export const getRecipe = async (request: GetRecipeRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;

  const recipe = await recipeRepository.fetchRecipe(recipeId);
  if (!recipe) {
    return reply.status(404).send('Recipe not found');
  }
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = await layout(new RecipePage(recipe, ingredients));

  return reply.type('text/html').send(template);
};

export const deleteRecipe = async (request: DeleteRecipeRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;
  const { query } = request.body;

  await recipeRepository.deleteRecipe(recipeId);
  let recipes = await recipeRepository.fetchRecipes(query);
  if (recipes.length === 0) {
    recipes = await recipeRepository.fetchRecipes('');
  }
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = await new RecipeList(recipes, ingredients, { swap: true }).render();

  return reply.type('text/html').send(template);
};

export const addRecipeIngredient = async (request: PostRecipeRequest, reply: FastifyReply) => {
  const recipeId = request.params.recipeId;
  const { ingredientId, amount } = request.body;

  const { amount: ingredientAmount, ingredient } = await recipeRepository.addIngredient(recipeId, ingredientId, Number(amount));
  const ingredients = await ingredientRepository.fetchIngredients();
  const recipe = await recipeRepository.fetchRecipe(recipeId);
  if (!recipe) {
    return reply.status(404).send('Recipe not found');
  }
  
  const template = `
    ${await new RecipeIngredientListItem(ingredientAmount, ingredient, recipeId, { isFirst: recipe.ingredients.length === 1 }).render()}
    ${await new RecipeDetails(recipe, { swap: true }).render()}
    ${await new NewRecipeIngredient(recipe, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};

export const updateRecipeIngredientAmount = async (request: UpdateRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;
  const { amount } = request.body;

  const recipe = await recipeRepository.updateIngredientAmount(recipeId, ingredientId, Number(amount));
  if (!recipe) {
    return reply.status(404).send('Recipe not found');
  }

  const template = await new RecipeDetails(recipe, { swap: true }).render();

  return reply.type('text/html').send(template);
};

export const deleteRecipeIngredient = async (request: DeleteRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;

  const recipe = await recipeRepository.deleteRecipeIngredient(recipeId, ingredientId);
  if (!recipe) {
    return reply.status(404).send('Recipe not found');
  }
  const recipeIngredientIds = recipe.ingredients.map(({ ingredient }) => ingredient.id);
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${await new RecipeIngredientList(recipe, ingredients, { layout: 'list', swap: true }).render()}
    ${await new RecipeDetails(recipe, { swap: true }).render()}
    ${await new IngredientSelector(recipeIngredientIds, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};

export const updateRecipeAmount = async (request: UpdateRecipeAmountRequest, reply: FastifyReply) => {
  const { recipeId } = request.params;
  const { amount } = request.body;

  await recipeRepository.updateRecipeAmount(recipeId, Number(amount));

  return reply.type('text/html').send();
};

export const newRecipe = async (_: FastifyRequest, reply: FastifyReply) => {
  const template = await layout(new NewRecipePage());

  return reply.type('text/html').send(template);
};

export const createRecipe = async (request: CreateRecipeRequest, reply: FastifyReply) => {
  const { recipeName } = request.body;

  const recipe = await recipeRepository.createRecipe(recipeName);
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${recipeHeader(recipe)}
    ${await new RecipeDetails(recipe, { swap: false }).render()}
    ${await new RecipeIngredientList(recipe, ingredients, { layout: 'container', swap: false }).render()}
  `;
  return reply.type('text/html').header('HX-Push-Url', `/recipe/${recipe.id}`).send(template);
};