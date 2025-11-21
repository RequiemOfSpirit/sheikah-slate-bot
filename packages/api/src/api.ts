import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { postgresConnector } from './plugins/postgres-connector.ts';
import { resourceDao } from './plugins/resource-dao.ts';
import { twitchChannelDao } from './plugins/twitch-channel-dao.ts';
import { resourceRoutes } from './routes/resources/index.ts';
import { twitchChannelRoutes } from './routes/twitch-channels/index.ts';

// Exposed as a separate plugin to allow easy OpenAPI spec generation
export const publicApis = fastifyPlugin((fastify: FastifyInstance) => {
  fastify.register(postgresConnector);
  fastify.register(resourceDao);
  fastify.register(resourceRoutes, { prefix: '/resources' });
});

export const publicAndInternalApis = fastifyPlugin((fastify: FastifyInstance) => {
  // Register postgres connector and all existing public routes
  fastify.register(publicApis);

  // Additional internal routes
  fastify.register(twitchChannelDao);
  fastify.register(twitchChannelRoutes, { prefix: '/twitch-channels' });
});
