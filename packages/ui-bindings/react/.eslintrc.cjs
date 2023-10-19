module.exports = {
  extends: ['plugin:react/recommended', require.resolve('../../../.eslintrc.cjs')],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'react/display-name': 'off',
    'react/prop-types': 'off',
  },
};
