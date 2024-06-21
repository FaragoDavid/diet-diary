import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout.js';
import { NewDayPage } from '../../pages/day.js';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const template = await layout(new NewDayPage());

  return reply.type('text/html').send(template);
};