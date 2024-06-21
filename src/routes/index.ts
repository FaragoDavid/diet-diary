import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import registerDashboardRoutes from './dashboard.js';
import registerIngredientRoutes from './ingredient.js';
import { getLogin, postLogin } from './login.js';
import registerMealRoutes from './meal.js';
import registerRecipeRoutes from './recipe.js';

const registerLoginRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', function handler(_: FastifyRequest, reply: FastifyReply) {
    reply.redirect(301, '/login');
  });
  fastify.get('/login', getLogin);
  fastify.post('/login', postLogin);
};

const registerRoutes = (fastify: FastifyInstance) => {
  registerDashboardRoutes(fastify);
  registerIngredientRoutes(fastify);
  registerRecipeRoutes(fastify);
  registerMealRoutes(fastify);
};

export { registerLoginRoutes, registerRoutes };
