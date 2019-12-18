const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.eslint,
  rules: {
    ...fabric.eslint.rules,
    '@typescript-eslint/prefer-interface': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/array-type': ['error', 'array-simple'],
    'no-return-assign': 0,
    semi: ['error', 'always'],
    'no-console': 0,
    'max-len': ['error', { code: 120, ignoreComments: true, ignoreStrings: true }],
    // see https://github.com/prettier/prettier/issues/3847
    'space-before-function-paren': ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
    'no-underscore-dangle': 0,
  },
};
