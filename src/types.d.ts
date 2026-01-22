import '@fastify/session';

declare global {
  type HtmxSwap = 'innerHTML' | 'outerHTML' | 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' | 'delete';
  type HtmxSwapOobOption = HtmxSwap | false;
}

declare module 'fastify' {
  interface Session {
    user?: {
      email: string;
      name?: string;
      picture?: string;
    };
  }

  interface FastifyInstance {
    googleOAuth2: any;
  }
}

export {};
