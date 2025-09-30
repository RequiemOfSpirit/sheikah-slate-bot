import { FastifyInstance } from 'fastify';
import { Resource } from '../model/resources.ts';

export const resourceRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', async (request) => {
    const query = request.query as { commandName?: string };

    /* List resources */
    if (query.commandName === undefined) {
      const resources: Resource[] = await fastify.resourceDao.getResources();
      return { resources };
    }

    /* Query resources by command name */
    const singletonResourceList: Resource[] = await fastify.resourceDao.queryResourcesByCommand(query.commandName);
    return { resources: singletonResourceList };
  });
};
