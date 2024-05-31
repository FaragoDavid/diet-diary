import * as dotenv from 'dotenv';
dotenv.config();

import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import { fastifyStatic } from '@fastify/static';
import fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config.js';
import { registerLoginRoutes, registerRoutes } from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({ logger: false });

app.register(fastifyFormbody);
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public/',
});
app.register(cookie, {
  secret: config.cookieSecret,
  parseOptions: {
    httpOnly: true,
    signed: true,
  },
} as FastifyCookieOptions);

registerLoginRoutes(app);
registerRoutes(app);

app.listen({ port: config.port, host: config.host }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
