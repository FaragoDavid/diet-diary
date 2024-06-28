import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout';
import { NewIngredientPage } from '../../pages/ingredient';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const template = await layout(new NewIngredientPage());

  return reply.type('text/html').send(template);
};
