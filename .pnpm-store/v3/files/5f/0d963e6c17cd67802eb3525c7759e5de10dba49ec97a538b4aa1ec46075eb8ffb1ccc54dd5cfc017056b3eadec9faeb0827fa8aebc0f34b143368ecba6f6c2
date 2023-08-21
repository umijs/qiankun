"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

const testCaseNames = new Set([...Object.keys(_utils.TestCaseName), 'it.only', 'it.skip', 'test.only', 'test.skip']);

const isTestArrowFunction = node => node.parent !== undefined && node.parent.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && testCaseNames.has((0, _utils.getNodeName)(node.parent.callee));

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      description: 'Disallow conditional logic',
      category: 'Best Practices',
      recommended: false
    },
    messages: {
      noIf: 'Tests should not contain if statements.',
      noConditional: 'Tests should not contain conditional statements.'
    },
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],

  create(context) {
    const stack = [];

    function validate(node) {
      const lastElementInStack = stack[stack.length - 1];

      if (stack.length === 0 || lastElementInStack === false) {
        return;
      }

      const messageId = node.type === _experimentalUtils.AST_NODE_TYPES.ConditionalExpression ? 'noConditional' : 'noIf';
      context.report({
        messageId,
        node
      });
    }

    return {
      CallExpression(node) {
        stack.push((0, _utils.isTestCase)(node));
      },

      FunctionExpression() {
        stack.push(false);
      },

      FunctionDeclaration() {
        stack.push(false);
      },

      ArrowFunctionExpression(node) {
        stack.push(isTestArrowFunction(node));
      },

      IfStatement: validate,
      ConditionalExpression: validate,

      'CallExpression:exit'() {
        stack.pop();
      },

      'FunctionExpression:exit'() {
        stack.pop();
      },

      'FunctionDeclaration:exit'() {
        stack.pop();
      },

      'ArrowFunctionExpression:exit'() {
        stack.pop();
      }

    };
  }

});

exports.default = _default;