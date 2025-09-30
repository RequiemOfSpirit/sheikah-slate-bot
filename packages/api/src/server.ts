import Fastify, { FastifyInstance } from 'fastify';
import { postgresConnector } from './plugins/postgres-connector.ts';
import { resourceDao } from './plugins/resource-dao.ts';
import { resourceRoutes } from './routes/resources.ts';

const fastify: FastifyInstance = Fastify({ logger: true });

fastify.register(postgresConnector);
fastify.register(resourceDao);
fastify.register(resourceRoutes, { prefix: '/resources' });

void (async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
