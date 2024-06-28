import { FastifyReply, FastifyRequest } from 'fastify';
import { layout } from '../components/layout';
import { Login } from '../pages/login';
import config from '../config';

type PostLoginRequest = FastifyRequest<{ Body: { password: string } & Record<string, string> }>;

export const getLogin = async (_: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie('loggedIn');

  const template = await layout(new Login());
  return reply.type('text/html').send(template);
};

export const postLogin = async (request: PostLoginRequest, reply: FastifyReply) => {
  const { password } = request.body;

  if (password === config.password) {
    return reply.setCookie('loggedIn', 'true').type('text/html').redirect(303, '/dashboard');
  } else {
    reply.redirect(301, '/login');
  }
};
