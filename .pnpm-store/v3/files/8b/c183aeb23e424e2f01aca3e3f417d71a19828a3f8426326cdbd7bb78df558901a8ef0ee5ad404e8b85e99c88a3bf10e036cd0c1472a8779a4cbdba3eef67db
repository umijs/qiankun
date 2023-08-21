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

const trimFXprefix = word => ['f', 'x'].includes(word.charAt(0)) ? word.substr(1) : word;

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce valid titles',
      recommended: false
    },
    messages: {
      duplicatePrefix: 'should not have duplicate prefix',
      accidentalSpace: 'should not have leading or trailing spaces'
    },
    type: 'suggestion',
    schema: [],
    fixable: 'code'
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!((0, _utils.isDescribe)(node) || (0, _utils.isTestCase)(node)) || !node.arguments.length) {
          return;
        }

        const _node$arguments = _slicedToArray(node.arguments, 1),
              argument = _node$arguments[0];

        if (!(0, _utils.isStringNode)(argument)) {
          return;
        }

        const title = (0, _utils.getStringValue)(argument);

        if (!title) {
          return;
        }

        if (title.trim().length !== title.length) {
          context.report({
            messageId: 'accidentalSpace',
            node: argument,

            fix(fixer) {
              const stringValue = argument.type === _experimentalUtils.AST_NODE_TYPES.TemplateLiteral ? `\`${argument.quasis[0].value.raw}\`` : argument.raw;
              return [fixer.replaceTextRange(argument.range, stringValue.replace(/^([`'"]) +?/, '$1').replace(/ +?([`'"])$/, '$1'))];
            }

          });
        }

        const nodeName = trimFXprefix((0, _utils.getNodeName)(node.callee));

        const _title$split = title.split(' '),
              _title$split2 = _slicedToArray(_title$split, 1),
              firstWord = _title$split2[0];

        if (firstWord.toLowerCase() === nodeName) {
          context.report({
            messageId: 'duplicatePrefix',
            node: argument,

            fix(fixer) {
              const stringValue = argument.type === _experimentalUtils.AST_NODE_TYPES.TemplateLiteral ? `\`${argument.quasis[0].value.raw}\`` : argument.raw;
              return [fixer.replaceTextRange(argument.range, stringValue.replace(/^([`'"]).+? /, '$1'))];
            }

          });
        }
      }

    };
  }

});

exports.default = _default;