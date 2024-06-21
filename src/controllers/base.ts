import { FastifyReply, FastifyRequest } from 'fastify';

const cookieValidator = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.cookies.loggedIn) return reply.redirect(301, '/login');
};

export default (handler: (request: FastifyRequest<any>, reply: FastifyReply) => Promise<void>) => {
  return {
    preHandler: cookieValidator,
    handler,
    errorHandler: (error: Error) => {
      console.log(error);
      throw error;
    },
  };
};
