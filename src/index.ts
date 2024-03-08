import { fastifyStatic } from '@fastify/static';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';

import registerRoutes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({ logger: true });

app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public/',
});

registerRoutes(app);

export default async function handler(req: FastifyRequest, reply: FastifyReply) {
  await app.ready();
  app.server.emit('request', req, reply);
}
