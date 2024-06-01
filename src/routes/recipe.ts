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
import { selectIngredients } from '../repository/ingredient.js';
import * as recipeRepository from '../repository/recipe.js';
import * as ingredientRepository from '../repository/ingredient.js';
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

  return reply.type('text/html').send(template);
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

  const recipe = await recipeRepository.selectRecipe(recipeId);
  const ingredients = await selectIngredients();

  const template = await layout(new RecipePage(recipe, ingredients));

  return reply.type('text/html').send(template);
};

export const deleteRecipe = async (request: DeleteRecipeRequest, reply: FastifyReply) => {
  // const { recipeId } = request.params;
  // const { query } = request.body;

  // await recipeRepository.deleteRecipe(recipeId);
  // let recipes = await recipeRepository.selectRecipes(query);
  // if(recipes.length === 0) {
  //   recipes = await recipeRepository.selectRecipes('');
  // }
  // const ingredients = await selectIngredients();

  // const template = await new RecipeList(recipes, ingredients, { swap: true }).render();

  // return reply.type('text/html').send(template);
};

export const addRecipeIngredient = async (request: PostRecipeRequest, reply: FastifyReply) => {
  const recipeId = request.params.recipeId;
  const { ingredientId, amount } = request.body;

  const ingredient = await recipeRepository.insertRecipeIngredient(recipeId, ingredientId, Number(amount));
  const ingredients = await selectIngredients();
  const recipe = await recipeRepository.selectRecipe(recipeId);

  const template = `
    ${await new RecipeIngredientListItem(ingredient, recipeId, ingredients, { isFirst: recipe.ingredients.length === 1 }).render()}
    ${await new RecipeDetails(recipe, ingredients, { swap: true }).render()}
    ${await new NewRecipeIngredient(recipe, ingredients, { swap: true }).render()}
  `;

  return reply.type('text/html').send(template);
};

export const updateRecipeIngredientAmount = async (request: UpdateRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;
  const { amount } = request.body;

  const recipe = await recipeRepository.updateRecipeIngredientAmount(recipeId, ingredientId, Number(amount));
  const ingredients = await selectIngredients();

  const template = await new RecipeDetails(recipe, ingredients, { swap: true }).render();

  return reply.type('text/html').send(template);
};

export const deleteRecipeIngredient = async (request: DeleteRecipeIngredientRequest, reply: FastifyReply) => {
  const { recipeId, ingredientId } = request.params;

  const recipe = await recipeRepository.deleteRecipeIngredient(recipeId, ingredientId);
  const ingredients = await selectIngredients();

  const template = `
    ${await new RecipeIngredientList(recipe, ingredients, { layout: 'list', swap: true }).render()}
    ${await new RecipeDetails(recipe, ingredients, { swap: true }).render()}
    ${await new IngredientSelector(recipe.ingredients, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
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

  const recipe = await recipeRepository.insertRecipe(recipeName);
  const ingredients = await selectIngredients();

  const template = `
    ${recipeHeader(recipe)}
    ${await new RecipeDetails(recipe, ingredients, { swap: false }).render()}
    ${await new RecipeIngredientList(recipe, ingredients, { layout: 'container', swap: false }).render()}
  `;
  return reply.type('text/html').header('HX-Push-Url', `/recipe/${recipe.id}`).send(template);
};