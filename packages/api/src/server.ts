import Fastify, { FastifyInstance } from 'fastify';
import { app } from './app.ts';

const fastify: FastifyInstance = Fastify({ logger: true });
fastify.register(app);

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
