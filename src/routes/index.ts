import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../components/layout.js';
import { Dashboard } from '../components/pages/dashboard.js';
import { getRecipe, getRecipeById, getRecipes, updateRecipe } from './recipe-routes.js';
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
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const template = await layout(new Dashboard());
      return reply.type('text/html').send(template);
    },
  });

  fastify.get('/days', getDays);

  fastify.get('/ingredient', getIngredient);
  fastify.post('/ingredient', adIngredient);

  fastify.get('/recipe', getRecipe);
  fastify.get('/recipes', getRecipes);
  fastify.get('/recipe/:recipeId', getRecipeById);
  fastify.post('/recipe/:recipeId', updateRecipe);
};

export { registerLoginRoutes, registerRoutes };
