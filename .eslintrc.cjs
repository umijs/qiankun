// eslint config for js
const jsConfig = {
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'no-else-return': ['error', { allowElseIf: false }],
    'object-shorthand': ['error', 'properties'],
    'no-shadow': 'off',
  },
};

// eslint config for cjs
const cjsConfig = {
  parserOptions: { sourceType: 'script' },
  env: { node: true },
};

// eslint config for ts
const tsConfig = {
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json', './packages/**/tsconfig.json'],
  },
  rules: {
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
};

module.exports = {
  root: true,
  ...jsConfig,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      ...tsConfig,
    },
    {
      files: ['*.cjs', 'packages/webpack-plugin/**/*.js'],
      ...cjsConfig,
    },
  ],
};
