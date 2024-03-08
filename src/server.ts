import { fastifyStatic } from '@fastify/static';
import { fastify } from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';

import registerRoutes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({ logger: true });

app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public/',
});

registerRoutes(app);

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
