import { render } from '@lit-labs/ssr';
import { RenderResultReadable } from '@lit-labs/ssr/lib/render-result-readable.js';
import { Dashboard } from './components/dashboard.js';
import { layout } from './components/layout.js';
import { SsrLitElement } from './lib/ssr-lit-element.js';

const renderLayout = async (bodyComponent: SsrLitElement): Promise<RenderResultReadable> => {
  return new RenderResultReadable(await layout(bodyComponent));
};

const renderComponent = async (component: SsrLitElement): Promise<RenderResultReadable> => {
  return new RenderResultReadable(render(await component.render()));
};

const server = (fastify) => {
  fastify.get('/', function handler(request, reply) {
    reply.redirect(301, '/dashboard');
  });

  fastify.get('/dashboard', async (request, reply) => {
    const template = await renderLayout(new Dashboard());
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
