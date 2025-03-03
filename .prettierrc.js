/**
 * @typedef { import('prettier').Config &
 *   import('@ianvs/prettier-plugin-sort-imports').PluginConfig
 * } PrettierConfig
 */

/** @type {PrettierConfig} */
export default {
  /* Rules */
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  quoteProps: 'consistent',
  trailingComma: 'all',
  semi: true,
  overrides: [
    // Override to add trailing commas to tsconfig
    {
      files: ['tsconfig*.json'],
      options: {
        parser: 'jsonc',
      },
    },
  ],

  plugins: ['@ianvs/prettier-plugin-sort-imports'],

  /* `ianvs-sort-imports` plugin rules */
  importOrder: ['^@/(.*)$', '^@tests/(.*)$', '^[./]'],
};
