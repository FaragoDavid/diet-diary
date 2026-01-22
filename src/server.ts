import * as dotenv from 'dotenv';
dotenv.config();

import cookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import fastifySession from '@fastify/session';
import fastifyOAuth from '@fastify/oauth2';
import { fastifyStatic } from '@fastify/static';
import fastify from 'fastify';
import path from 'path';

import config from './config';
import { registerLoginRoutes, registerRoutes } from './routes/index';

const app = fastify({ logger: false });

app.register(fastifyFormbody);
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public/',
});
app.register(cookie);
app.register(fastifySession, {
  secret: config.sessionSecret,
  cookie: { secure: false },
});

if (config.oauth.google.clientId && config.oauth.google.clientSecret) {
  app.register(fastifyOAuth, {
    name: 'googleOAuth2',
    credentials: {
      client: {
        id: config.oauth.google.clientId,
        secret: config.oauth.google.clientSecret,
      },
      auth: fastifyOAuth.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/auth/google',
    callbackUri: config.oauth.google.callbackUrl,
  });
}

registerLoginRoutes(app);
registerRoutes(app);

app.listen({ port: config.port, host: config.host }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
