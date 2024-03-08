import fastify, { FastifyRequest } from 'fastify';

import { server } from '../src/server.js';

const app = fastify({ logger: false });
app.register(server, { prefix: '/' });

export default async (req: FastifyRequest, res) => {
  await app.ready();
  app.server.emit('request', req, res);
};
