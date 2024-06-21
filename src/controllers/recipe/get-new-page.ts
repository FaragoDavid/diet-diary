import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../../components/layout.js';
import { NewRecipePage } from '../../pages/recipe.js';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const template = await layout(new NewRecipePage());

  return reply.type('text/html').send(template);
};