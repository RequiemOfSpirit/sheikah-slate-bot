import 'fastify';

declare module 'fastify' {
  export type FastifyPluginDoneCallback = (err?: Error) => void;

  interface FastifySchema {
    /**
     * OpenAPI operation unique identifier
     */
    operationId?: string;
  }
}
