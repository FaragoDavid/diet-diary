import fastify from 'fastify';

import { server } from '../src/server';

const app = fastify({ logger: false });
app.register(server, { prefix: '/' });

export default async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
};
