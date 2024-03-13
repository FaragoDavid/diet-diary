
import fastify from 'fastify';
import { fastifyStatic } from '@fastify/static';
import fastifyFormbody from '@fastify/formbody';
import cors from '@fastify/cors';
import path from 'path';
import { fileURLToPath } from 'url';

import registerRoutes from './routes.js';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({ logger: true });

app.register(fastifyFormbody);
app.register(cors, {
  origin: /.*\/public\/.*/,
});
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public/',
});

registerRoutes(app);

app.listen({ port: config.port, host: config.host }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
