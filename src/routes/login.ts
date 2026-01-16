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

  if (!password || password.trim().length === 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Password is required</div>');
  }

  if (password === config.password) {
    return reply.setCookie('loggedIn', 'true').type('text/html').redirect('/dashboard', 303);
  } else {
    reply.redirect('/login', 301);
  }
};
