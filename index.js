const path = require('node:path');
const database = require('./deprecated/database');
database.initialize();

const fastify = require('fastify')({ logger: true });
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
});
fastify.register(require('@fastify/formbody'));
fastify.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs')
  }
});

require('./deprecated/server_old')(fastify);
