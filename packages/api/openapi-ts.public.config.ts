import path from 'path';
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './build/spec/openapi-public.json',
  output: {
    path: './build/client/public/',
    tsConfigPath: path.join(import.meta.dirname, 'tsconfig.client.json'),
  },
  plugins: [
    {
      name: '@hey-api/client-fetch',
      throwOnError: true,
    },
    {
      name: '@hey-api/sdk',
      asClass: true,
      instance: 'sheikahSlateBotApiClient',
    },
  ],
});
