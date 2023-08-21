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

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `toHaveLength()`',
      recommended: false
    },
    messages: {
      useToHaveLength: 'Use toHaveLength() instead'
    },
    fixable: 'code',
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isExpectCall)(node)) {
          return;
        }

        const _parseExpectCall = (0, _utils.parseExpectCall)(node),
              _parseExpectCall$expe = _slicedToArray(_parseExpectCall.expect.arguments, 1),
              argument = _parseExpectCall$expe[0],
              matcher = _parseExpectCall.matcher;

        if (!matcher || !(0, _utils.isParsedEqualityMatcherCall)(matcher) || !argument || argument.type !== _experimentalUtils.AST_NODE_TYPES.MemberExpression || !(0, _utils.isSupportedAccessor)(argument.property, 'length') || argument.property.type !== _experimentalUtils.AST_NODE_TYPES.Identifier) {
          return;
        }

        context.report({
          fix(fixer) {
            const propertyDot = context.getSourceCode().getFirstTokenBetween(argument.object, argument.property, token => token.value === '.');
            /* istanbul ignore if */

            if (propertyDot === null) {
              throw new Error(`Unexpected null when attempting to fix ${context.getFilename()} - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`);
            }

            return [fixer.remove(propertyDot), fixer.remove(argument.property), fixer.replaceText(matcher.node.property, 'toHaveLength')];
          },

          messageId: 'useToHaveLength',
          node: matcher.node.property
        });
      }

    };
  }

});

exports.default = _default;