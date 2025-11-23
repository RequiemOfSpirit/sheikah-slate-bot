import { FastifyInstance, FastifyPluginDoneCallback, FastifyPluginOptions } from 'fastify';
import fastifyPlugin, { PluginMetadata } from 'fastify-plugin';
import { Resource } from '../model/index.ts';

declare module 'fastify' {
  interface FastifyInstance {
    resourceDao: {
      /**
       * @returns List of all Resources in the database.
       */
      listResources: () => Promise<Resource[]>;

      /**
       * @returns Singleton list containing the Resource linked to the requested command.
       *          Empty list if the command does not exist.
       */
      queryResourcesByCommand: (commandName: string) => Promise<Resource[]>;
    };
  }
}

const pluginMetadata: PluginMetadata = {
  name: 'resource-dao',
  dependencies: ['postgres-connector'],
};

export const resourceDao = fastifyPlugin(
  (fastify: FastifyInstance, _opts: FastifyPluginOptions, done: FastifyPluginDoneCallback) => {
    fastify.decorate('resourceDao', {
      listResources: async (): Promise<Resource[]> => {
        const query = `
          SELECT
            resource.id AS id,
            resource.title AS title,
            resource.content AS content,
            array_agg(command.name) AS commands
          FROM resources resource
          INNER JOIN commands command
            ON resource.id = command.resource_id
          GROUP BY resource.id;
        `;

        const { rows } = await fastify.pg.query(query);
        return rows as Resource[];
      },
      queryResourcesByCommand: async (commandName: string): Promise<Resource[]> => {
        const query = {
          text: `
            SELECT
              resource.id AS id,
              resource.title AS title,
              resource.content AS content,
              array_agg(command.name) AS commands
            FROM resources resource
            INNER JOIN commands command
              ON resource.id = command.resource_id
            WHERE resource.id = (
              SELECT resource_id
              FROM commands
              WHERE name = $1
            )
            GROUP BY resource.id;
          `,
          values: [commandName],
        };

        const { rows } = await fastify.pg.query(query);
        return rows as Resource[];
      },
    });

    done();
  },
  pluginMetadata,
);
