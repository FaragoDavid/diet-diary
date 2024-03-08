import { Dashboard } from './components/dashboard.js';
import { layout } from './components/layout.js';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Days } from './components/days.js';

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate: number; toDate: number } }>;

const registerRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', function handler(request: FastifyRequest, reply: FastifyReply) {
    reply.redirect(301, '/dashboard');
  });

  fastify.get('/dashboard', async (request: FastifyRequest, reply: FastifyReply) => {
    const template = await layout(new Dashboard());
    return reply.type('text/html').send(template);
  });

  fastify.get('/meals', async (request: GetMealsRequest, reply: FastifyReply) => {
    const fromDate = new Date(request.query.fromDate);
    const toDate = new Date(request.query.toDate);

    const template = await new Days(fromDate, toDate).render();
    return reply.type('text/html').send(template);
  });
};

export default registerRoutes;