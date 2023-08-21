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

function isFunctionBodyEmpty(node) {
  /* istanbul ignore if https://github.com/typescript-eslint/typescript-eslint/issues/734 */
  if (!node.body) {
    throw new Error(`Unexpected null while performing prefer-todo - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`);
  }

  return node.body.type === _experimentalUtils.AST_NODE_TYPES.BlockStatement && node.body.body && !node.body.body.length;
}

function isTestBodyEmpty(node) {
  const _node$arguments = _slicedToArray(node.arguments, 2),
        fn = _node$arguments[1];

  return fn && (0, _utils.isFunction)(fn) && isFunctionBodyEmpty(fn);
}

function addTodo(node, fixer) {
  const testName = (0, _utils.getNodeName)(node.callee).split('.').shift();
  return fixer.replaceText(node.callee, `${testName}.todo`);
}

const isTargetedTestCase = node => (0, _utils.isTestCase)(node) && [_utils.TestCaseName.it, _utils.TestCaseName.test, 'it.skip', 'test.skip'].includes((0, _utils.getNodeName)(node.callee));

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `test.todo`',
      recommended: false
    },
    messages: {
      todoOverEmpty: 'Prefer todo test case over empty test case',
      todoOverUnimplemented: 'Prefer todo test case over unimplemented test case'
    },
    fixable: 'code',
    schema: [],
    type: 'layout'
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        const _node$arguments2 = _slicedToArray(node.arguments, 2),
              firstArg = _node$arguments2[0],
              secondArg = _node$arguments2[1];

        if (!isTargetedTestCase(node) || !(0, _utils.isStringNode)(firstArg)) {
          return;
        }

        if (isTestBodyEmpty(node)) {
          context.report({
            messageId: 'todoOverEmpty',
            node,
            fix: fixer => [fixer.removeRange([firstArg.range[1], secondArg.range[1]]), addTodo(node, fixer)]
          });
        }

        if ((0, _utils.hasOnlyOneArgument)(node)) {
          context.report({
            messageId: 'todoOverUnimplemented',
            node,
            fix: fixer => [addTodo(node, fixer)]
          });
        }
      }

    };
  }

});

exports.default = _default;