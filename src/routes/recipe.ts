import { FastifyInstance } from 'fastify';

import createHandler from '../controllers/base.js';
import createRecipe from '../controllers/recipe/create.js';
import deleteRecipe from '../controllers/recipe/delete.js';
import getRecipeList from '../controllers/recipe/get-list.js';
import newRecipePage from '../controllers/recipe/get-new-page.js';
import getRecipePage from '../controllers/recipe/get-page.js';
import getRecipeTab from '../controllers/recipe/get-tab.js';
import addRecipeIngredient from '../controllers/recipe/add-ingredient.js';
import deleteRecipeIngredient from '../controllers/recipe/delete-ingredient.js';
import updateRecipeIngredientAmount from '../controllers/recipe/update-ingredient-amount.js';
import updateRecipeAmount from '../controllers/recipe/update-amount.js';

export default async (fastify: FastifyInstance) => {
  fastify.get('/recipesTab', createHandler(getRecipeTab));
  fastify.get('/recipes', createHandler(getRecipeList));
  fastify.get('/new-recipe', createHandler(newRecipePage));
  fastify.post('/new-recipe', createHandler(createRecipe));
  fastify.get('/recipe/:recipeId', createHandler(getRecipePage));
  fastify.delete('/recipe/:recipeId', createHandler(deleteRecipe));
  fastify.post('/recipe/:recipeId/amount', createHandler(updateRecipeAmount));
  fastify.post('/recipe/:recipeId/ingredient', createHandler(addRecipeIngredient));
  fastify.post('/recipe/:recipeId/ingredient/:ingredientId', createHandler(updateRecipeIngredientAmount));
  fastify.delete('/recipe/:recipeId/ingredient/:ingredientId', createHandler(deleteRecipeIngredient));
};