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
} from './recipe-routes.js';
import { getLogin, postLogin } from './login-routes.js';
import { addIngredient, getIngredient } from './ingredient-routes.js';
import { getDays } from './meal-routes.js';

const createHandler = (handler: (request: FastifyRequest<any>, reply: FastifyReply) => Promise<void>) => {
  return { preHandler: cookieValidator, handler };
}

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

  fastify.get('/days', createHandler(getDays));

  fastify.get('/ingredient', createHandler(getIngredient));
  fastify.post('/ingredient', createHandler(addIngredient));

  fastify.get('/new-recipe', createHandler(newRecipe));
  fastify.post('/new-recipe', createHandler(createRecipe));
  fastify.get('/recipes', createHandler(getRecipes));
  fastify.get('/recipe/:recipeId', createHandler(editRecipe));
  fastify.post('/recipe/:recipeId', createHandler(updateRecipeAmount('list')));
  fastify.post('/recipe/:recipeId/detail', createHandler(updateRecipeAmount('detail')));
  fastify.post('/recipe/:recipeId/ingredient', createHandler(addRecipeIngredient));
  fastify.post('/recipe/:recipeId/ingredient/:ingredientId', createHandler(updateRecipeIngredientAmount));
  fastify.delete('/recipe/:recipeId/ingredient/:ingredientId', createHandler(deleteRecipeIngredient));
};

export { registerLoginRoutes, registerRoutes };
