import { FastifyReply, FastifyRequest } from 'fastify';

const cookieValidator = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.session.user) return reply.redirect('/login', 301);
};

export default (handler: (request: FastifyRequest<any>, reply: FastifyReply) => Promise<void>) => {
  return {
    preHandler: cookieValidator,
    handler: async (request: FastifyRequest<any>, reply: FastifyReply) => {
      try {
        await handler(request, reply);
      } catch (error) {
        console.error('Error in request handler:', error);

        if (!reply.sent) {
          return reply.status(500).type('text/html').send(`
              <div class="alert alert-error">
                <h2>An error occurred</h2>
                <p>Something went wrong processing your request. Please try again.</p>
              </div>
            `);
        }
      }
    },
  };
};
