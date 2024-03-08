import Fastify, { FastifyReply, FastifyRequest } from 'fastify';

import registerRoutes from './routes';

const app = Fastify({ logger: true });

registerRoutes(app);

export default async function handler(req: FastifyRequest, reply: FastifyReply) {
  await app.ready();
  app.server.emit('request', req, reply);
}
