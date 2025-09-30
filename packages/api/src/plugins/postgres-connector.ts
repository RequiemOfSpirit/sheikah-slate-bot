import fastifyPostgres from '@fastify/postgres';
import { FastifyInstance, FastifyPluginDoneCallback, FastifyPluginOptions } from 'fastify';
import fastifyPlugin, { PluginMetadata } from 'fastify-plugin';
import { DATABASE_URL } from '../utils/env.ts';

const pluginMetadata: PluginMetadata = { name: 'postgres-connector' };

export const postgresConnector = fastifyPlugin(
  (fastify: FastifyInstance, _opts: FastifyPluginOptions, done: FastifyPluginDoneCallback) => {
    fastify.register(fastifyPostgres, { connectionString: DATABASE_URL });
    done();
  },
  pluginMetadata,
);
