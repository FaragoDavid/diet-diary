import { FastifyInstance, FastifyReply } from 'fastify';

import createHandler from '../controllers/base';
import getTab from '../controllers/dashboard/get';

export default async (fastify: FastifyInstance) => {
  fastify.get(
    '/dashboard',
    createHandler(async (_, reply: FastifyReply) => reply.redirect(301, '/dashboard/meals')),
  );
  fastify.get('/dashboard/:target', createHandler(getTab));
};
