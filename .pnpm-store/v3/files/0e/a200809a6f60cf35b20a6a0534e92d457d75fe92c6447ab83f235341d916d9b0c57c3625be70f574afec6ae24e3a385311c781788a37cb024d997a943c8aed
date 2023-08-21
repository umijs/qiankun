"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const RETURN_STATEMENT = 'ReturnStatement';
const BLOCK_STATEMENT = 'BlockStatement';

const getBody = args => {
  const _args = _slicedToArray(args, 2),
        secondArg = _args[1];

  if (secondArg && (0, _utils.isFunction)(secondArg) && secondArg.body && secondArg.body.type === BLOCK_STATEMENT) {
    return secondArg.body.body;
  }

  return [];
};

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow explicitly returning from tests',
      recommended: false
    },
    messages: {
      noReturnValue: 'Jest tests should not return a value.'
    },
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isTestCase)(node)) return;
        const body = getBody(node.arguments);
        const returnStmt = body.find(t => t.type === RETURN_STATEMENT);
        if (!returnStmt) return;
        context.report({
          messageId: 'noReturnValue',
          node: returnStmt
        });
      }

    };
  }

});

exports.default = _default;