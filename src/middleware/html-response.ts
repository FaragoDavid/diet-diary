import { FastifyReply, FastifyRequest } from 'fastify';

export type HtmlResponse = string | { template: string; url?: string } | { error: string };

export const htmlResponseMiddleware = (handler: (request: FastifyRequest<any>, reply: FastifyReply) => Promise<HtmlResponse | void>) => {
  return async (request: FastifyRequest<any>, reply: FastifyReply) => {
    const result = await handler(request, reply);

    if (reply.sent) return;

    if (!result) return;

    if (typeof result === 'string') {
      return reply.type('text/html').send(result);
    }

    if ('error' in result) {
      return reply.status(400).type('text/html').send(`<div class="alert alert-error">${result.error}</div>`);
    }

    if (result.template) {
      reply.type('text/html');
      if (result.url) {
        reply.header('HX-Push-Url', result.url);
      }
      return reply.send(result.template);
    }
  };
};
