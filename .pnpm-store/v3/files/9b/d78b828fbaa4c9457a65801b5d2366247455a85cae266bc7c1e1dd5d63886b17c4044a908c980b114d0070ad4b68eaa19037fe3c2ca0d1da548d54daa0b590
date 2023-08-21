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

const isBooleanLiteral = node => node.type === _experimentalUtils.AST_NODE_TYPES.Literal && typeof node.value === 'boolean';

/**
 * Checks if the given `ParsedExpectMatcher` is a call to one of the equality matchers,
 * with a boolean literal as the sole argument.
 *
 * @example javascript
 * toBe(true);
 * toEqual(false);
 *
 * @param {ParsedExpectMatcher} matcher
 *
 * @return {matcher is ParsedBooleanEqualityMatcher}
 */
const isBooleanEqualityMatcher = matcher => (0, _utils.isParsedEqualityMatcherCall)(matcher) && isBooleanLiteral((0, _utils.followTypeAssertionChain)(matcher.arguments[0]));

/**
 * Checks if the given `node` is a `CallExpression` representing the calling
 * of an `includes`-like method that can be 'fixed' (using `toContain`).
 *
 * @param {CallExpression} node
 *
 * @return {node is FixableIncludesCallExpression}
 *
 * @todo support `['includes']()` syntax (remove last property.type check to begin)
 * @todo break out into `isMethodCall<Name extends string>(node: TSESTree.Node, method: Name)` util-fn
 */
const isFixableIncludesCallExpression = node => node.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && node.callee.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression && (0, _utils.isSupportedAccessor)(node.callee.property, 'includes') && node.callee.property.type === _experimentalUtils.AST_NODE_TYPES.Identifier && (0, _utils.hasOnlyOneArgument)(node);

const buildToContainFuncExpectation = negated => negated ? `${_utils.ModifierName.not}.toContain` : 'toContain';
/**
 * Finds the first `.` character token between the `object` & `property` of the given `member` expression.
 *
 * @param {TSESTree.MemberExpression} member
 * @param {SourceCode} sourceCode
 *
 * @return {Token | null}
 */


const findPropertyDotToken = (member, sourceCode) => sourceCode.getFirstTokenBetween(member.object, member.property, token => token.value === '.');

const getNegationFixes = (node, modifier, matcher, sourceCode, fixer, fileName) => {
  const _node$arguments = _slicedToArray(node.arguments, 1),
        containArg = _node$arguments[0];

  const negationPropertyDot = findPropertyDotToken(modifier.node, sourceCode);
  const toContainFunc = buildToContainFuncExpectation((0, _utils.followTypeAssertionChain)(matcher.arguments[0]).value);
  /* istanbul ignore if */

  if (negationPropertyDot === null) {
    throw new Error(`Unexpected null when attempting to fix ${fileName} - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`);
  }

  return [fixer.remove(negationPropertyDot), fixer.remove(modifier.node.property), fixer.replaceText(matcher.node.property, toContainFunc), fixer.replaceText(matcher.arguments[0], sourceCode.getText(containArg))];
};

const getCommonFixes = (node, sourceCode, fileName) => {
  const _node$arguments2 = _slicedToArray(node.arguments, 1),
        containArg = _node$arguments2[0];

  const includesCallee = node.callee;
  const propertyDot = findPropertyDotToken(includesCallee, sourceCode);
  const closingParenthesis = sourceCode.getTokenAfter(containArg);
  const openParenthesis = sourceCode.getTokenBefore(containArg);
  /* istanbul ignore if */

  if (propertyDot === null || closingParenthesis === null || openParenthesis === null) {
    throw new Error(`Unexpected null when attempting to fix ${fileName} - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`);
  }

  return [containArg, includesCallee.property, propertyDot, closingParenthesis, openParenthesis];
}; // expect(array.includes(<value>)[not.]{toBe,toEqual}(<boolean>)


var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `toContain()`',
      recommended: false
    },
    messages: {
      useToContain: 'Use toContain() instead'
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
              includesCall = _parseExpectCall$expe[0],
              matcher = _parseExpectCall.matcher,
              modifier = _parseExpectCall.modifier;

        if (!matcher || modifier && modifier.name !== _utils.ModifierName.not || !isBooleanEqualityMatcher(matcher) || !isFixableIncludesCallExpression(includesCall)) {
          return;
        }

        context.report({
          fix(fixer) {
            const sourceCode = context.getSourceCode();
            const fileName = context.getFilename();
            const fixArr = getCommonFixes(includesCall, sourceCode, fileName).map(target => fixer.remove(target));

            if (modifier && modifier.name === _utils.ModifierName.not) {
              return getNegationFixes(includesCall, modifier, matcher, sourceCode, fixer, fileName).concat(fixArr);
            }

            const toContainFunc = buildToContainFuncExpectation(!(0, _utils.followTypeAssertionChain)(matcher.arguments[0]).value);

            const _includesCall$argumen = _slicedToArray(includesCall.arguments, 1),
                  containArg = _includesCall$argumen[0];

            fixArr.push(fixer.replaceText(matcher.node.property, toContainFunc));
            fixArr.push(fixer.replaceText(matcher.arguments[0], sourceCode.getText(containArg)));
            return fixArr;
          },

          messageId: 'useToContain',
          node: (modifier || matcher).node.property
        });
      }

    };
  }

});

exports.default = _default;