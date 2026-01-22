import { FastifyReply, FastifyRequest } from 'fastify';
import { layout } from '../components/layout';
import { Login } from '../pages/login';
import config from '../config';

export const getLogin = async (request: FastifyRequest, reply: FastifyReply) => {
  request.session.destroy();

  const template = await layout(new Login());
  return reply.type('text/html').send(template);
};

export const getGoogleCallback = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = await request.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo = (await userInfoResponse.json()) as { email: string; name?: string; picture?: string };

    if (!config.oauth.allowedEmails.includes(userInfo.email)) {
      return reply.type('text/html').send(`
        <html>
          <head><title>Access Denied</title></head>
          <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1>Access Denied</h1>
            <p>Your email (${userInfo.email}) is not authorized to access this application.</p>
            <a href="/login">Back to Login</a>
          </body>
        </html>
      `);
    }

    request.session.user = {
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };

    return reply.redirect('/dashboard', 303);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return reply.redirect('/login?error=oauth', 303);
  }
};

export const getLogout = async (request: FastifyRequest, reply: FastifyReply) => {
  request.session.destroy();
  return reply.redirect('/login', 303);
};
