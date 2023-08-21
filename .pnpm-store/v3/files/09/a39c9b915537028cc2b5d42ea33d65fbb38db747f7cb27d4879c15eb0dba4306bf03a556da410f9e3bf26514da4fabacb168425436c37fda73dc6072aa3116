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
      description: 'Avoid using a callback in asynchronous tests',
      recommended: false
    },
    messages: {
      illegalTestCallback: 'Illegal usage of test callback'
    },
    fixable: 'code',
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isTestCase)(node) || node.arguments.length !== 2) {
          return;
        }

        const _node$arguments = _slicedToArray(node.arguments, 2),
              callback = _node$arguments[1];

        if (!(0, _utils.isFunction)(callback) || callback.params.length !== 1) {
          return;
        }

        const _callback$params = _slicedToArray(callback.params, 1),
              argument = _callback$params[0];

        context.report({
          node: argument,
          messageId: 'illegalTestCallback',

          fix(fixer) {
            const body = callback.body;
            /* istanbul ignore if https://github.com/typescript-eslint/typescript-eslint/issues/734 */

            if (!body) {
              throw new Error(`Unexpected null when attempting to fix ${context.getFilename()} - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`);
            }

            const sourceCode = context.getSourceCode();
            const firstBodyToken = sourceCode.getFirstToken(body);
            const lastBodyToken = sourceCode.getLastToken(body);
            const tokenBeforeArgument = sourceCode.getTokenBefore(argument);
            const tokenAfterArgument = sourceCode.getTokenAfter(argument);
            /* istanbul ignore if */

            if (!('name' in argument) || !firstBodyToken || !lastBodyToken || !tokenBeforeArgument || !tokenAfterArgument) {
              throw new Error(`Unexpected null when attempting to fix ${context.getFilename()} - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`);
            }

            const argumentInParens = tokenBeforeArgument.value === '(' && tokenAfterArgument.value === ')';
            let argumentFix = fixer.replaceText(argument, '()');

            if (argumentInParens) {
              argumentFix = fixer.remove(argument);
            }

            let newCallback = argument.name;

            if (argumentInParens) {
              newCallback = `(${newCallback})`;
            }

            let beforeReplacement = `new Promise(${newCallback} => `;
            let afterReplacement = ')';
            let replaceBefore = true;

            if (body.type === 'BlockStatement') {
              const keyword = callback.async ? 'await' : 'return';
              beforeReplacement = `${keyword} ${beforeReplacement}{`;
              afterReplacement += '}';
              replaceBefore = false;
            }

            return [argumentFix, replaceBefore ? fixer.insertTextBefore(firstBodyToken, beforeReplacement) : fixer.insertTextAfter(firstBodyToken, beforeReplacement), fixer.insertTextAfter(lastBodyToken, afterReplacement)];
          }

        });
      }

    };
  }

});

exports.default = _default;