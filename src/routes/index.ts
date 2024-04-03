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
import { adIngredient, getIngredient } from './ingredient-routes.js';
import { getDays } from './meal-routes.js';

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

  fastify.get('/days', { preHandler: cookieValidator, handler: getDays });

  fastify.get('/ingredient', { preHandler: cookieValidator, handler: getIngredient });
  fastify.post('/ingredient', { preHandler: cookieValidator, handler: adIngredient });

  fastify.get('/new-recipe', { preHandler: cookieValidator, handler: newRecipe });
  fastify.post('/new-recipe', { preHandler: cookieValidator, handler: createRecipe });
  fastify.get('/recipes', { preHandler: cookieValidator, handler: getRecipes });
  fastify.get('/recipe/:recipeId', { preHandler: cookieValidator, handler: editRecipe });
  fastify.post('/recipe/:recipeId', { preHandler: cookieValidator, handler: updateRecipeAmount });
  fastify.post('/recipe/:recipeId/ingredient', { preHandler: cookieValidator, handler: addRecipeIngredient });
  fastify.post('/recipe/:recipeId/ingredient/:ingredientId', { preHandler: cookieValidator, handler: updateRecipeIngredientAmount });
  fastify.delete('/recipe/:recipeId/ingredient/:ingredientId', { preHandler: cookieValidator, handler: deleteRecipeIngredient });
};

export { registerLoginRoutes, registerRoutes };
