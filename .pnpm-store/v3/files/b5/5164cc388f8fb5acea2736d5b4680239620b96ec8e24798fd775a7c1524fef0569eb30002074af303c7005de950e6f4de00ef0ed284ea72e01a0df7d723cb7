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

const isExpectAssertionsOrHasAssertionsCall = expression => {
  if (expression.type !== _experimentalUtils.AST_NODE_TYPES.CallExpression || expression.callee.type !== _experimentalUtils.AST_NODE_TYPES.MemberExpression || !(0, _utils.isSupportedAccessor)(expression.callee.object, 'expect') || !(0, _utils.isSupportedAccessor)(expression.callee.property)) {
    return false;
  }

  const expectAssertionName = (0, _utils.getAccessorValue)(expression.callee.property);

  if (expectAssertionName !== 'assertions') {
    return expectAssertionName === 'hasAssertions';
  }

  const _expression$arguments = _slicedToArray(expression.arguments, 1),
        arg = _expression$arguments[0];

  return expression.arguments && expression.arguments.length === 1 && arg.type === _experimentalUtils.AST_NODE_TYPES.Literal && typeof arg.value === 'number' && Number.isInteger(arg.value);
};

const getFunctionFirstLine = functionBody => functionBody[0] && functionBody[0].expression;

const isFirstLineExprStmt = functionBody => functionBody[0] && functionBody[0].type === _experimentalUtils.AST_NODE_TYPES.ExpressionStatement;

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `expect.assertions()` OR `expect.hasAssertions()`',
      recommended: false
    },
    messages: {
      haveExpectAssertions: 'Every test should have either `expect.assertions(<number of assertions>)` or `expect.hasAssertions()` as its first expression'
    },
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      'CallExpression[callee.name=/^(it|test)$/][arguments.1.body.body]'(node) {
        const testFuncBody = node.arguments[1].body.body;

        if (!isFirstLineExprStmt(testFuncBody)) {
          context.report({
            messageId: 'haveExpectAssertions',
            node
          });
          return;
        }

        const testFuncFirstLine = getFunctionFirstLine(testFuncBody);

        if (!isExpectAssertionsOrHasAssertionsCall(testFuncFirstLine)) {
          context.report({
            messageId: 'haveExpectAssertions',
            node
          });
        }
      }

    };
  }

});

exports.default = _default;