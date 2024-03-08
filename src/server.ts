import Fastify from 'fastify';

import registerRoutes from './routes.js';

const app = Fastify({ logger: true });

registerRoutes(app);

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
