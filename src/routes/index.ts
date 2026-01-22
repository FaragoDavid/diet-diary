import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import registerDashboardRoutes from './dashboard';
import registerIngredientRoutes from './ingredient';
import { getLogin, getGoogleCallback, getLogout } from './login';
import registerMealRoutes from './meal';
import registerRecipeRoutes from './recipe';

const registerLoginRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', function handler(_: FastifyRequest, reply: FastifyReply) {
    reply.redirect('/login', 301);
  });
  fastify.get('/login', getLogin);
  fastify.get('/logout', getLogout);
  fastify.get('/auth/google/callback', getGoogleCallback);

  // Test-only endpoint for Cypress E2E tests
  if (process.env.NODE_ENV === 'test' || process.env.ENABLE_TEST_LOGIN === 'true') {
    const testLogin = (request: FastifyRequest, reply: FastifyReply) => {
      request.session.user = {
        email: 'test@example.com',
        name: 'Test User',
      };
      return reply.redirect('/dashboard', 303);
    };

    fastify.post('/login', testLogin);
    fastify.get('/test-login', testLogin);
  }
};

const registerRoutes = (fastify: FastifyInstance) => {
  registerDashboardRoutes(fastify);
  registerIngredientRoutes(fastify);
  registerRecipeRoutes(fastify);
  registerMealRoutes(fastify);
};

export { registerLoginRoutes, registerRoutes };
