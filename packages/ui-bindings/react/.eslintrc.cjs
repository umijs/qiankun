module.exports = {
  extends: ['plugin:react/recommended', require.resolve('../../../.eslintrc.cjs')],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'react/prop-types': 'off',
  },
};
