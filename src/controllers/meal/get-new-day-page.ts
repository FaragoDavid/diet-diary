import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout';
import { NewDayPage } from '../../pages/day';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const template = await layout(new NewDayPage());

  return reply.type('text/html').send(template);
};