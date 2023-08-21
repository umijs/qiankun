const stylelint = require('stylelint');
const propertiesOrderRule = require('stylelint-order/rules/properties-order');
const configCreator = require('../config/configCreator');

const ruleName = 'plugin/rational-order';

module.exports = stylelint.createPlugin(
  ruleName,
  (enabled, options, context) => (postcssRoot, postcssResult) => {
    const validOptions = stylelint.utils.validateOptions(
      postcssResult,
      ruleName,
      {
        actual: enabled,
        possible: [true, false],
      },
      {
        actual: options,
        optional: true,
        possible: {
          'border-in-box-model': [true, false],
          'empty-line-between-groups': [true, false],
        },
      },
    );
    if (!enabled || !validOptions) {
      return;
    }
    const expectation = configCreator(options);
    propertiesOrderRule(expectation, undefined, context)(postcssRoot, postcssResult);
  },
);

module.exports.ruleName = ruleName;
