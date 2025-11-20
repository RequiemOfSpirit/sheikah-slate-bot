import Fastify, { FastifyInstance } from 'fastify';
import { publicAndInternalApis } from './api.ts';

const internalFastifyInstance: FastifyInstance = Fastify({ logger: true });
internalFastifyInstance.register(publicAndInternalApis);

try {
  await internalFastifyInstance.listen({ port: 3333, host: '0.0.0.0' });
} catch (err) {
  internalFastifyInstance.log.error(err);
  process.exit(1);
}
