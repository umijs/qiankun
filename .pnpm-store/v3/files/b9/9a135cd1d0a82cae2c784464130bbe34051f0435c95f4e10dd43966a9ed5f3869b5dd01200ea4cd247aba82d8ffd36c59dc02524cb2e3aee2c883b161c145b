"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

/*
 * This implementation is ported from from eslint-plugin-jasmine.
 * MIT license, Tom Vincent.
 */

/**
 * Async assertions might be called in Promise
 * methods like `Promise.x(expect1)` or `Promise.x([expect1, expect2])`.
 * If that's the case, Promise node have to be awaited or returned.
 *
 * @Returns CallExpressionNode
 */
const getPromiseCallExpressionNode = node => {
  if (node && node.type === _experimentalUtils.AST_NODE_TYPES.ArrayExpression && node.parent && node.parent.type === _experimentalUtils.AST_NODE_TYPES.CallExpression) {
    node = node.parent;
  }

  if (node.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && node.callee && node.callee.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression && (0, _utils.isSupportedAccessor)(node.callee.object) && (0, _utils.getAccessorValue)(node.callee.object) === 'Promise' && node.parent) {
    return node;
  }

  return null;
};

const findPromiseCallExpressionNode = node => node.parent && node.parent.parent && [_experimentalUtils.AST_NODE_TYPES.CallExpression, _experimentalUtils.AST_NODE_TYPES.ArrayExpression].includes(node.parent.type) ? getPromiseCallExpressionNode(node.parent) : null;

const getParentIfThenified = node => {
  const grandParentNode = node.parent && node.parent.parent;

  if (grandParentNode && grandParentNode.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && grandParentNode.callee && (0, _utils.isExpectMember)(grandParentNode.callee) && ['then', 'catch'].includes((0, _utils.getAccessorValue)(grandParentNode.callee.property)) && grandParentNode.parent) {
    // Just in case `then`s are chained look one above.
    return getParentIfThenified(grandParentNode);
  }

  return node;
};

const isAcceptableReturnNode = (node, allowReturn) => allowReturn && node.type === _experimentalUtils.AST_NODE_TYPES.ReturnStatement || [_experimentalUtils.AST_NODE_TYPES.ArrowFunctionExpression, _experimentalUtils.AST_NODE_TYPES.AwaitExpression].includes(node.type);

const promiseArrayExceptionKey = ({
  start,
  end
}) => `${start.line}:${start.column}-${end.line}:${end.column}`;

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce valid `expect()` usage',
      recommended: 'error'
    },
    messages: {
      multipleArgs: 'More than one argument was passed to expect().',
      noArgs: 'No arguments were passed to expect().',
      noAssertions: 'No assertion was called on expect().',
      invalidProperty: '"{{ propertyName }}" is not a valid property of expect.',
      propertyWithoutMatcher: '"{{ propertyName }}" needs to call a matcher.',
      matcherOnPropertyNotCalled: '"{{ propertyName }}" was not called.',
      asyncMustBeAwaited: 'Async assertions must be awaited{{ orReturned }}.',
      promisesWithAsyncAssertionsMustBeAwaited: 'Promises which return async assertions must be awaited{{ orReturned }}.'
    },
    type: 'suggestion',
    schema: [{
      type: 'object',
      properties: {
        alwaysAwait: {
          type: 'boolean',
          default: false
        }
      },
      additionalProperties: false
    }]
  },
  defaultOptions: [{
    alwaysAwait: false
  }],

  create(context, [{
    alwaysAwait
  }]) {
    // Context state
    const arrayExceptions = new Set();

    const pushPromiseArrayException = loc => arrayExceptions.add(promiseArrayExceptionKey(loc));
    /**
     * Promise method that accepts an array of promises,
     * (eg. Promise.all), will throw warnings for the each
     * unawaited or non-returned promise. To avoid throwing
     * multiple warnings, we check if there is a warning in
     * the given location.
     */


    const promiseArrayExceptionExists = loc => arrayExceptions.has(promiseArrayExceptionKey(loc));

    return {
      CallExpression(node) {
        if (!(0, _utils.isExpectCall)(node)) {
          return;
        }

        const _parseExpectCall = (0, _utils.parseExpectCall)(node),
              expect = _parseExpectCall.expect,
              modifier = _parseExpectCall.modifier,
              matcher = _parseExpectCall.matcher;

        if (expect.arguments.length > 1) {
          const secondArgumentLocStart = expect.arguments[1].loc.start;
          const lastArgumentLocEnd = expect.arguments[node.arguments.length - 1].loc.end;
          context.report({
            loc: {
              end: {
                column: lastArgumentLocEnd.column - 1,
                line: lastArgumentLocEnd.line
              },
              start: secondArgumentLocStart
            },
            messageId: 'multipleArgs',
            node
          });
        } else if (expect.arguments.length === 0) {
          const expectLength = (0, _utils.getAccessorValue)(expect.callee).length;
          context.report({
            loc: {
              end: {
                column: node.loc.start.column + expectLength + 1,
                line: node.loc.start.line
              },
              start: {
                column: node.loc.start.column + expectLength,
                line: node.loc.start.line
              }
            },
            messageId: 'noArgs',
            node
          });
        } // something was called on `expect()`


        if (!matcher) {
          if (modifier) {
            context.report({
              data: {
                propertyName: modifier.name
              },
              // todo: rename to 'modifierName'
              messageId: 'propertyWithoutMatcher',
              // todo: rename to 'modifierWithoutMatcher'
              node: modifier.node.property
            });
          }

          return;
        }

        if (matcher.node.parent && (0, _utils.isExpectMember)(matcher.node.parent)) {
          context.report({
            messageId: 'invalidProperty',
            // todo: rename to 'invalidModifier'
            data: {
              propertyName: matcher.name
            },
            // todo: rename to 'matcherName' (or modifierName?)
            node: matcher.node.property
          });
          return;
        }

        if (!matcher.arguments) {
          context.report({
            data: {
              propertyName: matcher.name
            },
            // todo: rename to 'matcherName'
            messageId: 'matcherOnPropertyNotCalled',
            // todo: rename to 'matcherNotCalled'
            node: matcher.node.property
          });
        }

        const parentNode = matcher.node.parent;

        if (!modifier || !parentNode || !parentNode.parent || modifier.name === _utils.ModifierName.not) {
          return;
        }
        /**
         * If parent node is an array expression, we'll report the warning,
         * for the array object, not for each individual assertion.
         */


        const isParentArrayExpression = parentNode.parent.type === _experimentalUtils.AST_NODE_TYPES.ArrayExpression;
        const orReturned = alwaysAwait ? '' : ' or returned';
        /**
         * An async assertion can be chained with `then` or `catch` statements.
         * In that case our target CallExpression node is the one with
         * the last `then` or `catch` statement.
         */

        const targetNode = getParentIfThenified(parentNode);
        const finalNode = findPromiseCallExpressionNode(targetNode) || targetNode;

        if (finalNode.parent && // If node is not awaited or returned
        !isAcceptableReturnNode(finalNode.parent, !alwaysAwait) && // if we didn't warn user already
        !promiseArrayExceptionExists(finalNode.loc)) {
          context.report({
            loc: finalNode.loc,
            data: {
              orReturned
            },
            messageId: finalNode === targetNode ? 'asyncMustBeAwaited' : 'promisesWithAsyncAssertionsMustBeAwaited',
            node
          });

          if (isParentArrayExpression) {
            pushPromiseArrayException(finalNode.loc);
          }
        }
      },

      // nothing called on "expect()"
      'CallExpression:exit'(node) {
        if ((0, _utils.isExpectCall)(node) && node.parent.type === _experimentalUtils.AST_NODE_TYPES.ExpressionStatement) {
          context.report({
            messageId: 'noAssertions',
            node
          });
        }
      }

    };
  }

});

exports.default = _default;