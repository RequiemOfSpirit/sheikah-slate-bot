import fs from 'fs';
import fastifySwagger from '@fastify/swagger';
import Fastify from 'fastify';
import { app } from '@sheikah-slate-bot/api';

const fastify = Fastify();

await fastify.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.4',
    info: {
      title: 'Sheikah Slate Bot API',
      description: 'APIs that provide basic CRUDL operations for Sheikah Slate Resources',
      version: '0.0.0',
    },
  },
});

fastify.register(app);
await fastify.ready();

const openApiSpec = fastify.swagger();
fs.writeFileSync('dist/openapi.json', JSON.stringify(openApiSpec));
