"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const hasStringAsFirstArgument = node => node.arguments && node.arguments[0] && (node.arguments[0].type === _experimentalUtils.AST_NODE_TYPES.Literal || node.arguments[0].type === _experimentalUtils.AST_NODE_TYPES.TemplateLiteral);

const isJestFunctionWithLiteralArg = node => ((0, _utils.isTestCase)(node) || (0, _utils.isDescribe)(node)) && node.callee.type === _experimentalUtils.AST_NODE_TYPES.Identifier && hasStringAsFirstArgument(node);

const testDescription = argument => {
  if (argument.type === _experimentalUtils.AST_NODE_TYPES.Literal) {
    const value = argument.value;

    if (typeof value === 'string') {
      return value;
    }

    return null;
  }

  return argument.quasis[0].value.raw;
};

const jestFunctionName = (node, allowedPrefixes) => {
  const description = testDescription(node.arguments[0]);

  if (description === null || allowedPrefixes.some(name => description.startsWith(name))) {
    return null;
  }

  const firstCharacter = description.charAt(0);

  if (!firstCharacter) {
    return null;
  }

  if (firstCharacter !== firstCharacter.toLowerCase()) {
    return node.callee.name;
  }

  return null;
};

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce `it`, `test` and `describe` to have descriptions that begin with a lowercase letter. This provides more readable test failures.',
      category: 'Best Practices',
      recommended: false
    },
    fixable: 'code',
    messages: {
      unexpectedLowercase: '`{{ method }}`s should begin with lowercase'
    },
    schema: [{
      type: 'object',
      properties: {
        ignore: {
          type: 'array',
          items: {
            enum: [_utils.DescribeAlias.describe, _utils.TestCaseName.test, _utils.TestCaseName.it]
          },
          additionalItems: false
        },
        allowedPrefixes: {
          type: 'array',
          items: {
            type: 'string'
          },
          additionalItems: false
        }
      },
      additionalProperties: false
    }]
  },
  defaultOptions: [{
    ignore: [],
    allowedPrefixes: []
  }],

  create(context, [{
    ignore = [],
    allowedPrefixes = []
  }]) {
    return {
      CallExpression(node) {
        if (!isJestFunctionWithLiteralArg(node)) {
          return;
        }

        const erroneousMethod = jestFunctionName(node, allowedPrefixes);

        if (erroneousMethod && !ignore.includes(node.callee.name)) {
          context.report({
            messageId: 'unexpectedLowercase',
            data: {
              method: erroneousMethod
            },
            node,

            fix(fixer) {
              const _node$arguments = _slicedToArray(node.arguments, 1),
                    firstArg = _node$arguments[0]; // guaranteed by jestFunctionName


              const description = testDescription(firstArg);
              const rangeIgnoringQuotes = [firstArg.range[0] + 1, firstArg.range[1] - 1];
              const newDescription = description.substring(0, 1).toLowerCase() + description.substring(1);
              return [fixer.replaceTextRange(rangeIgnoringQuotes, newDescription)];
            }

          });
        }
      }

    };
  }

});

exports.default = _default;