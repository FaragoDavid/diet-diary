import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import registerDashboardRoutes from './dashboard';
import registerIngredientRoutes from './ingredient';
import { getLogin, postLogin } from './login';
import registerMealRoutes from './meal';
import registerRecipeRoutes from './recipe';

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
