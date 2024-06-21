import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout.js';
import { NewIngredientPage } from '../../pages/ingredient.js';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const template = await layout(new NewIngredientPage());

  return reply.type('text/html').send(template);
};
