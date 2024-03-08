import { fastify } from 'fastify';
import { fastifyStatic } from '@fastify/static';
import { server } from './server.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fastifyFormbody from '@fastify/formbody';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastifyInstance = fastify({ logger: true });

fastifyInstance.register(fastifyFormbody);
fastifyInstance.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public/',
});

server(fastifyInstance);
