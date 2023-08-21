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

const newDescribeContext = () => ({
  describeTitles: [],
  testTitles: []
});

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow identical titles',
      recommended: 'error'
    },
    messages: {
      multipleTestTitle: 'Test title is used multiple times in the same describe block.',
      multipleDescribeTitle: 'Describe block title is used multiple times in the same describe block.'
    },
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],

  create(context) {
    const contexts = [newDescribeContext()];
    return {
      CallExpression(node) {
        const currentLayer = contexts[contexts.length - 1];

        if ((0, _utils.isDescribe)(node)) {
          contexts.push(newDescribeContext());
        }

        const _node$arguments = _slicedToArray(node.arguments, 1),
              argument = _node$arguments[0];

        if (!argument || !(0, _utils.isStringNode)(argument)) {
          return;
        }

        const title = (0, _utils.getStringValue)(argument);

        if ((0, _utils.isTestCase)(node)) {
          if (currentLayer.testTitles.includes(title)) {
            context.report({
              messageId: 'multipleTestTitle',
              node: argument
            });
          }

          currentLayer.testTitles.push(title);
        }

        if (!(0, _utils.isDescribe)(node)) {
          return;
        }

        if (currentLayer.describeTitles.includes(title)) {
          context.report({
            messageId: 'multipleDescribeTitle',
            node: argument
          });
        }

        currentLayer.describeTitles.push(title);
      },

      'CallExpression:exit'(node) {
        if ((0, _utils.isDescribe)(node)) {
          contexts.pop();
        }
      }

    };
  }

});

exports.default = _default;