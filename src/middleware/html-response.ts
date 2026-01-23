import { FastifyReply, FastifyRequest } from 'fastify';

export type HtmlResponse = string | { template: string; url?: string };

export const htmlResponseMiddleware = (handler: (request: FastifyRequest<any>, reply: FastifyReply) => Promise<HtmlResponse | void>) => {
  return async (request: FastifyRequest<any>, reply: FastifyReply) => {
    const result = await handler(request, reply);

    // If reply already sent (e.g., early error returns), skip
    if (reply.sent) return;

    // If no result, assume handler already sent response
    if (!result) return;

    // If result is string, it's the template
    if (typeof result === 'string') {
      return reply.type('text/html').send(result);
    }

    // If result is object with template and optional url
    if (result.template) {
      reply.type('text/html');
      if (result.url) {
        reply.header('HX-Push-Url', result.url);
      }
      return reply.send(result.template);
    }
  };
};
