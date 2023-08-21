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

const paramsLocation = params => {
  const _params = _slicedToArray(params, 1),
        first = _params[0];

  const last = params[params.length - 1];
  return {
    start: first.loc.start,
    end: last.loc.end
  };
};

const isDescribeEach = node => node.callee.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression && (0, _utils.isSupportedAccessor)(node.callee.property, 'each');

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'Using an improper `describe()` callback function can lead to unexpected test errors.',
      recommended: 'warn'
    },
    messages: {
      nameAndCallback: 'Describe requires name and callback arguments',
      firstArgumentMustBeName: 'First argument must be name',
      secondArgumentMustBeFunction: 'Second argument must be function',
      noAsyncDescribeCallback: 'No async describe callback',
      unexpectedDescribeArgument: 'Unexpected argument(s) in describe callback',
      unexpectedReturnInDescribe: 'Unexpected return statement in describe callback'
    },
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isDescribe)(node) || isDescribeEach(node)) {
          return;
        }

        if (node.arguments.length === 0) {
          return context.report({
            messageId: 'nameAndCallback',
            loc: node.loc
          });
        }

        const _node$arguments = _slicedToArray(node.arguments, 2),
              name = _node$arguments[0],
              callback = _node$arguments[1];

        if (!(0, _utils.isStringNode)(name)) {
          context.report({
            messageId: 'firstArgumentMustBeName',
            loc: paramsLocation(node.arguments)
          });
        }

        if (!callback) {
          context.report({
            messageId: 'nameAndCallback',
            loc: paramsLocation(node.arguments)
          });
          return;
        }

        if (!(0, _utils.isFunction)(callback)) {
          context.report({
            messageId: 'secondArgumentMustBeFunction',
            loc: paramsLocation(node.arguments)
          });
          return;
        }

        if (callback.async) {
          context.report({
            messageId: 'noAsyncDescribeCallback',
            node: callback
          });
        }

        if (callback.params.length) {
          context.report({
            messageId: 'unexpectedDescribeArgument',
            loc: paramsLocation(callback.params)
          });
        }

        if (callback.body && callback.body.type === _experimentalUtils.AST_NODE_TYPES.BlockStatement) {
          callback.body.body.forEach(node => {
            if (node.type === _experimentalUtils.AST_NODE_TYPES.ReturnStatement) {
              context.report({
                messageId: 'unexpectedReturnInDescribe',
                node
              });
            }
          });
        }
      }

    };
  }

});

exports.default = _default;