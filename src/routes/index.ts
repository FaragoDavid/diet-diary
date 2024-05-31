import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { subDays } from 'date-fns';
import { layout } from '../components/layout.js';
import { Dashboard } from '../pages/dashboard.js';
import { fetchIngredients } from '../repository/ingredient.js';
import { fetchDays } from '../repository/meal.js';
import * as ingredientRoutes from './ingredient.js';
import { getLogin, postLogin } from './login.js';
import * as mealRoutes from './meal.js';
import * as recipeRoutes from './recipe.js';

const createHandler = (handler: (request: FastifyRequest<any>, reply: FastifyReply) => Promise<void>) => {
  return {
    preHandler: cookieValidator,
    handler,
    errorHandler: (error: Error) => {
      console.log(error);
      throw error;
    },
  };
};

const registerLoginRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', function handler(_: FastifyRequest, reply: FastifyReply) {
    reply.redirect(301, '/login');
  });
  fastify.get('/login', getLogin);
  fastify.post('/login', postLogin);
};

const cookieValidator = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.cookies.loggedIn) return reply.status(401).send('Unauthorized');
};

const registerRoutes = (fastify: FastifyInstance) => {
  fastify.get(
    '/dashboard',
    createHandler(async (_, reply: FastifyReply) => {

      const fromDate = subDays(new Date(), 7);
      const toDate = new Date();
      const days = await fetchDays(fromDate, toDate);
      const ingredients = await fetchIngredients();

      const template = await layout(new Dashboard(days, ingredients));
      return reply.type('text/html').send(template);
    }),
  );

  fastify.get('/ingredientsTab', createHandler(ingredientRoutes.displayIngredientsTab));
  fastify.get('/ingredients', createHandler(ingredientRoutes.getIngredients));
  fastify.get('/new-ingredient', createHandler(ingredientRoutes.newIngredient));
  fastify.post('/new-ingredient', createHandler(ingredientRoutes.createIngredient));
  fastify.get('/ingredient/:ingredientId', createHandler(ingredientRoutes.getIngredient));
  fastify.delete('/ingredient/:ingredientId', createHandler(ingredientRoutes.deleteIngredient));
  fastify.post('/ingredient/:ingredientId', createHandler(ingredientRoutes.updateIngredient));

  fastify.get('/recipesTab', createHandler(recipeRoutes.displayRecipesTab));
  fastify.get('/recipes', createHandler(recipeRoutes.getRecipes));
  fastify.get('/new-recipe', createHandler(recipeRoutes.newRecipe));
  fastify.post('/new-recipe', createHandler(recipeRoutes.createRecipe));
  fastify.get('/recipe/:recipeId', createHandler(recipeRoutes.getRecipe));
  fastify.delete('/recipe/:recipeId', createHandler(recipeRoutes.deleteRecipe));
  fastify.post('/recipe/:recipeId/amount', createHandler(recipeRoutes.updateRecipeAmount));
  fastify.post('/recipe/:recipeId/ingredient', createHandler(recipeRoutes.addRecipeIngredient));
  fastify.post('/recipe/:recipeId/ingredient/:ingredientId', createHandler(recipeRoutes.updateRecipeIngredientAmount));
  fastify.delete('/recipe/:recipeId/ingredient/:ingredientId', createHandler(recipeRoutes.deleteRecipeIngredient));

  fastify.get('/mealsTab', createHandler(mealRoutes.displayMealsTab));
  fastify.get('/days', createHandler(mealRoutes.getDays));
  fastify.get('/new-day', createHandler(mealRoutes.newDay));
  fastify.post('/new-day', createHandler(mealRoutes.createDay));
  fastify.get('/day/:date', createHandler(mealRoutes.getDay));
  fastify.post('/day/:date/meal', createHandler(mealRoutes.addMeal));
  fastify.delete('/day/:date/meal/:mealType', createHandler(mealRoutes.deleteMeal));
  fastify.post('/day/:date/meal/:mealType/dish', createHandler(mealRoutes.addDish));
  fastify.delete('/day/:date/meal/:mealType/dish/:dishId', createHandler(mealRoutes.deleteDish));
};

export { registerLoginRoutes, registerRoutes };
