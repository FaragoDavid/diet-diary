import { FastifyReply, FastifyRequest } from 'fastify';

import { Days } from '../components/overview/days.js';

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate: number; toDate: number } }>;

export const getDays = async (request: GetMealsRequest, reply: FastifyReply) => {
  const fromDate = new Date(request.query.fromDate);
  const toDate = new Date(request.query.toDate);

  const template = await new Days(fromDate, toDate).render();
  return reply.type('text/html').send(template);
};
