"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Require a message for `toThrow()`',
      recommended: false
    },
    messages: {
      requireRethrow: 'Add an error message to {{ propertyName }}()'
    },
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isExpectCall)(node)) {
          return;
        }

        const _parseExpectCall = (0, _utils.parseExpectCall)(node),
              matcher = _parseExpectCall.matcher,
              modifier = _parseExpectCall.modifier;

        if (matcher && matcher.arguments && matcher.arguments.length === 0 && ['toThrow', 'toThrowError'].includes(matcher.name) && (!modifier || !(modifier.name === _utils.ModifierName.not || modifier.negation))) {
          // Look for `toThrow` calls with no arguments.
          context.report({
            messageId: 'requireRethrow',
            // todo: rename to 'addErrorMessage'
            data: {
              propertyName: matcher.name
            },
            // todo: rename to 'matcherName'
            node: matcher.node.property
          });
        }
      }

    };
  }

});

exports.default = _default;