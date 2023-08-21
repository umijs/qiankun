"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

/*
 * This implementation is adapted from eslint-plugin-jasmine.
 * MIT license, Remco Haszing.
 */
var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce assertion to be made in a test body',
      recommended: false
    },
    messages: {
      noAssertions: 'Test has no assertions'
    },
    schema: [{
      type: 'object',
      properties: {
        assertFunctionNames: {
          type: 'array',
          items: [{
            type: 'string'
          }]
        }
      },
      additionalProperties: false
    }],
    type: 'suggestion'
  },
  defaultOptions: [{
    assertFunctionNames: ['expect']
  }],

  create(context, [{
    assertFunctionNames = ['expect']
  }]) {
    const unchecked = [];
    return {
      CallExpression(node) {
        const name = (0, _utils.getNodeName)(node.callee);

        if (name === _utils.TestCaseName.it || name === _utils.TestCaseName.test) {
          unchecked.push(node);
        } else if (name && assertFunctionNames.includes(name)) {
          // Return early in case of nested `it` statements.
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = context.getAncestors()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              const ancestor = _step.value;
              const index = ancestor.type === _experimentalUtils.AST_NODE_TYPES.CallExpression ? unchecked.indexOf(ancestor) : -1;

              if (index !== -1) {
                unchecked.splice(index, 1);
                break;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      },

      'Program:exit'() {
        unchecked.forEach(node => context.report({
          messageId: 'noAssertions',
          node
        }));
      }

    };
  }

});

exports.default = _default;