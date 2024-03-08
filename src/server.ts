import { Dashboard } from './components/dashboard.js';
import { layout } from './components/layout.js';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Days } from './components/days.js';

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate: number; toDate: number } }>;

const renderLayout = async (bodyComponent: BaseComponent): Promise<string> => {
  return layout(bodyComponent);
};

const renderComponent = async (component: BaseComponent): Promise<string> => {
  return component.render();
};

const server = (fastify: FastifyInstance) => {
  fastify.get('/', function handler(request: FastifyRequest, reply: FastifyReply) {
    reply.redirect(301, '/dashboard');
  });

  fastify.get('/dashboard', async (request: FastifyRequest, reply: FastifyReply) => {
    const template = await renderLayout(new Dashboard());
    return reply.type('text/html').send(template);
  });

  fastify.get('/meals', async (request: GetMealsRequest, reply: FastifyReply) => {
    console.log(request.query.fromDate, request.query.toDate);

    const template = await renderComponent(new Days(new Date(request.query.fromDate), new Date(request.query.toDate)));
    return reply.type('text/html').send(template);
  });

  fastify.listen({ port: 3000 }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

export { server };
