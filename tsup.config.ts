import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/discord/index.ts'],
  minify: true,
  format: 'esm',
});
