import { FastifyInstance } from 'fastify';
import { Resource } from '../../model/index.ts';
import { ListResourcesRouteInterface, listResourcesSchema } from './schema.ts';

export const resourceRoutes = (fastify: FastifyInstance) => {
  fastify.get<ListResourcesRouteInterface>('/', { schema: listResourcesSchema }, async (request) => {
    // List resources
    if (request.query.commandName === undefined) {
      const resources: Resource[] = await fastify.resourceDao.listResources();
      return { resources };
    }

    // Query resources by command name
    const singletonResourceList: Resource[] = await fastify.resourceDao.queryResourcesByCommand(
      request.query.commandName,
    );
    return { resources: singletonResourceList };
  });
};
