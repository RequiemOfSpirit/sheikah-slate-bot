import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { postgresConnector } from './plugins/postgres-connector.ts';
import { resourceDao } from './plugins/resource-dao.ts';
import { resourceRoutes } from './routes/resources/index.ts';

// Exposed as a separate plugin to allow easy OpenAPI spec generation
export const app = fastifyPlugin((fastify: FastifyInstance) => {
  fastify.register(postgresConnector);
  fastify.register(resourceDao);
  fastify.register(resourceRoutes, { prefix: '/resources' });
});
