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
    name: 'qiankun/vendored-single-spa',
    // Vendored single-spa fork (upstream 7.0 branch): keep recommended-level linting but relax the
    // strict type-checked rules — upstream code is not rewritten just to satisfy them. Tightening
    // happens incrementally in phase two (see the RFC in umijs/qiankun#3168). Unlike writable-dom
    // (globally ignored), this fork evolves first-hand, so it stays under the linter.
    files: ['packages/single-spa/**/*.ts'],
    languageOptions: {
      globals: {
        // the vendored specs run with vitest globals enabled (see vitest.config.ts)
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      'no-else-return': 'off',
      'object-shorthand': 'off',
      'prefer-const': 'off',
      'no-empty': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      // crashes on an upstream spec's `catch {}` block that rethrows an outer-scope identifier
      '@typescript-eslint/only-throw-error': 'off',
      'prefer-rest-params': 'off',
      'no-prototype-builtins': 'off',
      'no-unassigned-vars': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/await-thenable': 'off',
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
        // Judged against the oldest supported React, not the one installed for development: the
        // binding builds against React 19 but its peer range starts at 16.9, so rules that flag
        // React-19-era replacements (forwardRef → ref as a prop) must stay quiet.
        version: '18.3.1',
        importSource: 'react',
        polymorphicPropName: 'as',
      },
    },
  },
  eslintConfigPrettier,
]);
