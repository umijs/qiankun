// @ts-check

import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const javascriptFiles = ['packages/**/*.{js,mjs,cjs}'];
const typescriptFiles = ['packages/**/*.{ts,tsx}'];
const rootDirectory = dirname(fileURLToPath(import.meta.url));

const languageOptions = {
  ecmaVersion: 'latest',
  sourceType: 'module',
  globals: {
    ...globals.browser,
    ...globals.node,
  },
};

/** @type {import('eslint').Linter.RulesRecord} */
const projectRules = {
  'no-else-return': ['error', { allowElseIf: false }],
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['lodash/*'],
          message: "Import named methods from 'lodash'; the library build rewrites them to method subpaths.",
        },
      ],
    },
  ],
  'object-shorthand': ['error', 'properties'],
  'no-shadow': 'off',
};

export default defineConfig([
  globalIgnores(['**/.*', '**/dist/**', '**/examples/**', '**/writable-dom/**', '**/template/**', '**/__tests__/**']),
  {
    name: 'qiankun/linter-options',
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
  {
    name: 'qiankun/javascript',
    files: javascriptFiles,
    extends: [js.configs.recommended],
    languageOptions,
    rules: projectRules,
  },
  {
    name: 'qiankun/typescript',
    files: typescriptFiles,
    extends: [js.configs.recommended, tseslint.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      ...languageOptions,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: rootDirectory,
      },
    },
    rules: {
      ...projectRules,
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': ['error', { fixMixedExportsWithInlineTypeSpecifier: true }],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-shadow': ['error', { ignoreFunctionTypeParameterNameValueShadow: true }],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            returns: false,
            variables: false,
          },
        },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    name: 'qiankun/sandbox-boundaries',
    files: ['packages/sandbox/src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['lodash/*'],
              message: "Import named methods from 'lodash'; the library build rewrites them to method subpaths.",
            },
            {
              group: ['@qiankunjs/loader', '@qiankunjs/loader/**'],
              message: 'The standalone sandbox must not depend on the qiankun HTML loader.',
            },
          ],
        },
      ],
    },
  },
  {
    name: 'qiankun/sandbox-patcher-boundaries',
    files: ['packages/sandbox/src/patchers/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['lodash/*'],
              message: "Import named methods from 'lodash'; the library build rewrites them to method subpaths.",
            },
            {
              group: [
                '**/core/membrane',
                '**/core/membrane/**',
                '@qiankunjs/sandbox/**/membrane',
                '@qiankunjs/sandbox/**/membrane/**',
              ],
              message: 'Isolation plugins must only use the public Compartment API.',
            },
            {
              group: ['@qiankunjs/loader', '@qiankunjs/loader/**'],
              message: 'The standalone sandbox must not depend on the qiankun HTML loader.',
            },
          ],
        },
      ],
    },
  },
  {
    name: 'qiankun/commonjs',
    files: ['**/*.cjs', 'packages/bundler-plugin/tests/webpack{4,5}/webpack.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    name: 'qiankun/react',
    files: ['packages/ui-bindings/react/src/**/*.{ts,tsx}'],
    extends: [eslintReact.configs['recommended-typescript']],
    settings: {
      'react-x': {
        // Detection starts at the monorepo root, but this binding must remain compatible with React 18 and earlier.
        version: '18.3.1',
        importSource: 'react',
        polymorphicPropName: 'as',
      },
    },
  },
  eslintConfigPrettier,
]);
