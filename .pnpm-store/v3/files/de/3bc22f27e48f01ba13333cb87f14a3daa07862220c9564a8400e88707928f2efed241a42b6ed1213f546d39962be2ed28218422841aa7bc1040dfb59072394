"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

function isIdentifierResolves(node) {
  return node.property.type === _experimentalUtils.AST_NODE_TYPES.Identifier && node.property.name === 'resolves';
}

function isExpectResolves(node) {
  return (0, _utils.isExpectCall)(node.object) && isIdentifierResolves(node);
}

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow expect.resolves',
      recommended: false
    },
    messages: {
      expectResolves: 'Use `expect(await promise)` instead.'
    },
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],
  create: context => ({
    MemberExpression(node) {
      if (isExpectResolves(node)) {
        context.report({
          node: node.property,
          messageId: 'expectResolves'
        });
      }
    }

  })
});

exports.default = _default;