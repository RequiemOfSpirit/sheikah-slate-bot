import Fastify, { FastifyInstance } from 'fastify';
import { publicApis } from './api.ts';

const publicFastifyInstance: FastifyInstance = Fastify({ logger: true });
publicFastifyInstance.register(publicApis);

try {
  await publicFastifyInstance.listen({ port: 3000, host: '0.0.0.0' });
} catch (err) {
  publicFastifyInstance.log.error(err);
  process.exit(1);
}
