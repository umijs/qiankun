"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const testFunctions = new Set([_utils.DescribeAlias.describe, _utils.TestCaseName.test, _utils.TestCaseName.it]);

const matchesTestFunction = object => object && 'name' in object && (object.name in _utils.TestCaseName || object.name in _utils.DescribeAlias);

const isCallToFocusedTestFunction = object => object && object.name.startsWith('f') && testFunctions.has(object.name.substring(1));

const isPropertyNamedOnly = property => property && ('name' in property && property.name === 'only' || 'value' in property && property.value === 'only');

const isCallToTestOnlyFunction = callee => matchesTestFunction(callee.object) && isPropertyNamedOnly(callee.property);

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow focused tests',
      recommended: false
    },
    messages: {
      focusedTest: 'Unexpected focused test.'
    },
    fixable: 'code',
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],
  create: context => ({
    CallExpression(node) {
      const callee = node.callee;

      if (callee.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression) {
        if (callee.object.type === _experimentalUtils.AST_NODE_TYPES.Identifier && isCallToFocusedTestFunction(callee.object)) {
          context.report({
            messageId: 'focusedTest',
            node: callee.object
          });
          return;
        }

        if (callee.object.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression && isCallToTestOnlyFunction(callee.object)) {
          context.report({
            messageId: 'focusedTest',
            node: callee.object.property
          });
          return;
        }

        if (isCallToTestOnlyFunction(callee)) {
          context.report({
            messageId: 'focusedTest',
            node: callee.property
          });
          return;
        }
      }

      if (callee.type === _experimentalUtils.AST_NODE_TYPES.Identifier && isCallToFocusedTestFunction(callee)) {
        context.report({
          messageId: 'focusedTest',
          node: callee
        });
      }
    }

  })
});

exports.default = _default;