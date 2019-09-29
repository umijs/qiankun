const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.eslint,
  rules: {
    ...fabric.eslint.rules,
    '@typescript-eslint/prefer-interface': 0,
  },
};
