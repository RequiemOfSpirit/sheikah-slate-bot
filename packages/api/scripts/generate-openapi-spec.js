import fs from 'fs';
import fastifySwagger from '@fastify/swagger';
import Fastify from 'fastify';
import { publicAndInternalApis, publicApis } from '@sheikah-slate-bot/api';

// Initial setup
fs.mkdirSync('build/spec', { recursive: true });

// Spec for public APIs
const publicFastifyInstance = Fastify();
await publicFastifyInstance.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.4',
    info: {
      title: 'Sheikah Slate Bot API',
      description: 'Public APIs that provide basic CRUDL operations for Sheikah Slate Resources',
      version: '1.0.0',
    },
  },
});

publicFastifyInstance.register(publicApis);
await publicFastifyInstance.ready();

const publicOpenApiSpec = publicFastifyInstance.swagger();
fs.writeFileSync('build/spec/openapi-public.json', JSON.stringify(publicOpenApiSpec));

// Spec for internal APIs
const internalFastifyInstance = Fastify();
await internalFastifyInstance.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.4',
    info: {
      title: 'Sheikah Slate Bot API (Internal)',
      description:
        'Internal APIs that provide basic CRUDL operations for Sheikah Slate Resources and CRUDL operations for connected Twitch channels',
      version: '1.0.0',
    },
  },
});

internalFastifyInstance.register(publicAndInternalApis);
await internalFastifyInstance.ready();

const internalOpenApiSpec = internalFastifyInstance.swagger();
fs.writeFileSync('build/spec/openapi-internal.json', JSON.stringify(internalOpenApiSpec));
