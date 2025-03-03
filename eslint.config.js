/**
 * @typedef {import('typescript-eslint').ConfigWithExtends} TsConfig
 */
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettierConfigOverrides from 'eslint-config-prettier';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

/* Config objects recommended or required by 3rd party plugins but not provided out of the box */
/** @type {TsConfig} */
const tsEslintParserOptions = {
  languageOptions: {
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: import.meta.dirname,
    },
  },
};

// `tsEslint.config` adds type references to the config objects below without needing a long jsdoc @type comment
export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.strictTypeChecked,
  tsEslintParserOptions,
  stylistic.configs.recommended,
  prettierConfigOverrides,

  /* Global ignores */
  {
    ignores: ['dist', 'node_modules', 'temp'],
  },

  /* Global settings */
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Additional rules
      'array-callback-return': 'error',
      'prefer-const': 'error',
      'eqeqeq': 'warn',
      'object-shorthand': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': ['error', { considerDefaultExhaustiveForUnions: true }],

      /*
       * Additional stylistic rules
       * These will be replaced with `@stylistic` equivalents when `eslint-config-prettier` is updated (see comment block at the top)
       */
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: false }],

      // Overrides
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },

  /* Override type checking for config files */
  {
    files: ['**/*.js'],
    ...tsEslint.configs.disableTypeChecked,
  },

  /* Test specific overrides */
  {
    files: ['**/*.test.ts'],
    rules: {
      /*
       * Disable unsafe assignment and related rules for better test development experience.
       * Reference: https://github.com/vitest-dev/vitest/issues/4543#issuecomment-1824628142
       */
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',

      /*
       * Disable require-await for better test development experience.
       * Reference: https://github.com/testing-library/react-testing-library/issues/1061#issuecomment-1140112314
       */
      '@typescript-eslint/require-await': 'off',
    },
  },
);
