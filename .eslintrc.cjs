module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended-type-checked', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
  },
  rules: {
    '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/consistent-type-exports': ['error', { fixMixedExportsWithInlineTypeSpecifier: true }],
    '@typescript-eslint/require-await': 'off',
    'no-else-return': ['error', { allowElseIf: false }],
  },
};
