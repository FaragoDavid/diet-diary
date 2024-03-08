import { render } from '@lit-labs/ssr';
import { RenderResultReadable } from '@lit-labs/ssr/lib/render-result-readable.js';
import { Dashboard } from './components/dashboard.js';
import { layout } from './components/layout.js';
import { SsrLitElement } from './lib/ssr-lit-element.js';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Days } from './components/days.js';

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate: number; toDate: number } }>;

const renderLayout = async (bodyComponent: SsrLitElement): Promise<RenderResultReadable> => {
  return new RenderResultReadable(await layout(bodyComponent));
};

const renderComponent = async (component: SsrLitElement): Promise<RenderResultReadable> => {
  return new RenderResultReadable(render(await component.render()));
};

const server = (fastify: FastifyInstance) => {
  fastify.get('/', function handler(request: FastifyRequest, reply: FastifyReply) {
    reply.redirect(301, '/dashboard');
  });

  fastify.get('/dashboard', async (request: FastifyRequest, reply: FastifyReply) => {
    const template = await renderLayout(new Dashboard());
    return reply.send(template);
  });

  fastify.get('/meals', async (request: GetMealsRequest, reply: FastifyReply) => {
    console.log(request.query, request.query.toDate);
    
    const template = await renderComponent(new Days(new Date(request.query.fromDate), new Date(request.query.toDate)));
    return reply.send(template);
  });

  fastify.listen({ port: 3000 }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

export { server };
