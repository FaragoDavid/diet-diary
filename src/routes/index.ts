import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../components/layout.js';
import { Dashboard } from '../pages/dashboard.js';
import {
  createRecipe,
  deleteRecipeIngredient,
  editRecipe,
  getRecipes,
  newRecipe,
  addRecipeIngredient,
  updateRecipeAmount,
  updateRecipeIngredientAmount,
} from './recipe.js';
import { getLogin, postLogin } from './login.js';
import { addIngr, getIngredient } from './ingredient.js';
import { addDish, addMeal, createDay, editDay, getDay, getDays, newDay } from './meal.js';

const createHandler = (handler: (request: FastifyRequest<any>, reply: FastifyReply) => Promise<void>) => {
  return { preHandler: cookieValidator, handler };
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
  fastify.get('/dashboard', {
    preHandler: cookieValidator,
    handler: async (_, reply: FastifyReply) => {
      const template = await layout(new Dashboard());
      return reply.type('text/html').send(template);
    },
  });

  fastify.get('/ingredient', createHandler(getIngredient));
  fastify.post('/ingredient', createHandler(addIngr));

  fastify.get('/new-recipe', createHandler(newRecipe));
  fastify.post('/new-recipe', createHandler(createRecipe));
  fastify.get('/recipes', createHandler(getRecipes));
  fastify.get('/recipe/:recipeId', createHandler(editRecipe));
  fastify.post('/recipe/:recipeId', createHandler(updateRecipeAmount('list')));
  fastify.post('/recipe/:recipeId/detail', createHandler(updateRecipeAmount('detail')));
  fastify.post('/recipe/:recipeId/ingredient', createHandler(addRecipeIngredient));
  fastify.post('/recipe/:recipeId/ingredient/:ingredientId', createHandler(updateRecipeIngredientAmount));
  fastify.delete('/recipe/:recipeId/ingredient/:ingredientId', createHandler(deleteRecipeIngredient));

  fastify.get('/days', createHandler(getDays));
  fastify.get('/new-day', createHandler(newDay));
  fastify.post('/new-day', createHandler(createDay));
  fastify.get('/day/:date', createHandler(getDay));
  fastify.post('/day/:date/meal', createHandler(addMeal));
  fastify.post('/day/:date/meal/:mealType/dish', createHandler(addDish));
};

export { registerLoginRoutes, registerRoutes };
