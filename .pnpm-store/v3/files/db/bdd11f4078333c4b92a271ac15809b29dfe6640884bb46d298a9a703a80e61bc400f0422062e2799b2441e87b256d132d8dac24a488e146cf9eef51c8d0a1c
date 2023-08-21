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

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow empty titles',
      recommended: false
    },
    messages: {
      describe: 'describe should not have an empty title',
      test: 'test should not have an empty title'
    },
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isDescribe)(node) && !(0, _utils.isTestCase)(node)) {
          return;
        }

        const _node$arguments = _slicedToArray(node.arguments, 1),
              argument = _node$arguments[0];

        if (!argument || !(0, _utils.isStringNode)(argument, '')) {
          return;
        }

        context.report({
          messageId: (0, _utils.isDescribe)(node) ? _utils.DescribeAlias.describe : _utils.TestCaseName.test,
          node: argument
        });
      }

    };
  }

});

exports.default = _default;