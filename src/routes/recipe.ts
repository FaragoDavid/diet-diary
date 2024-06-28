import { FastifyInstance } from 'fastify';

import createHandler from '../controllers/base';
import createRecipe from '../controllers/recipe/create';
import deleteRecipe from '../controllers/recipe/delete';
import getRecipeList from '../controllers/recipe/get-list';
import newRecipePage from '../controllers/recipe/get-new-page';
import getRecipePage from '../controllers/recipe/get-page';
import getRecipeTab from '../controllers/recipe/get-tab';
import addRecipeIngredient from '../controllers/recipe/add-ingredient';
import deleteRecipeIngredient from '../controllers/recipe/delete-ingredient';
import updateRecipeIngredientAmount from '../controllers/recipe/update-ingredient-amount';
import updateRecipeAmount from '../controllers/recipe/update-amount';

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