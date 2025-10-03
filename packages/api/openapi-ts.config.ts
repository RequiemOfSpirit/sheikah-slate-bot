import path from 'path';
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './build/spec/openapi.json',
  output: {
    path: './build/client/',
    tsConfigPath: path.join(import.meta.dirname, 'tsconfig.client.json'),
  },
  plugins: [
    {
      name: '@hey-api/sdk',
      asClass: true,
      instance: 'sheikahSlateBotApiClient',
    },
  ],
});
