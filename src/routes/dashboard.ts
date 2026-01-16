import { FastifyInstance, FastifyReply } from 'fastify';

import createHandler from '../controllers/base';
import getTab from '../controllers/dashboard/get';

export default async (fastify: FastifyInstance) => {
  fastify.get(
    '/dashboard',
    createHandler(async (_, reply: FastifyReply) => reply.redirect('/dashboard/meals', 301)),
  );
  fastify.get('/dashboard/:target', createHandler(getTab));
};
