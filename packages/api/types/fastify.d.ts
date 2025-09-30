import 'fastify';

declare module 'fastify' {
  export type FastifyPluginDoneCallback = (err?: Error) => void;
}
