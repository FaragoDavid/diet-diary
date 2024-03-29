import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { layout } from '../components/layout.js';
import { Login } from '../components/pages/login.js';
import config from '../config.js';

type PostLoginRequest = FastifyRequest<{ Body: { password: string } & Record<string, string> }>;

export const getLogin = async (_: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie('loggedIn');

  const template = await layout(new Login());
  return reply.type('text/html').send(template);
};

export const postLogin = async (request: PostLoginRequest, reply: FastifyReply) => {
  const { password } = request.body;
  
  if (password === config.password) {
    reply.setCookie('loggedIn', 'true').redirect(301, '/dashboard');
  } else {
    reply.redirect(301, '/login');
  }
};
