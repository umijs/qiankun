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

const findNodeObject = node => {
  if ('object' in node) {
    return node.object;
  }

  if (node.callee.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression) {
    return node.callee.object;
  }

  return null;
};

const getJestFnCall = node => {
  if (node.type !== _experimentalUtils.AST_NODE_TYPES.CallExpression && node.type !== _experimentalUtils.AST_NODE_TYPES.MemberExpression) {
    return null;
  }

  const obj = findNodeObject(node);

  if (!obj) {
    return null;
  }

  if (obj.type === _experimentalUtils.AST_NODE_TYPES.Identifier) {
    return node.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && (0, _utils.getNodeName)(node.callee) === 'jest.fn' ? node : null;
  }

  return getJestFnCall(obj);
};

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `jest.spyOn()`',
      recommended: false
    },
    messages: {
      useJestSpyOn: 'Use jest.spyOn() instead.'
    },
    fixable: 'code',
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],

  create(context) {
    return {
      AssignmentExpression(node) {
        const left = node.left,
              right = node.right;
        if (left.type !== _experimentalUtils.AST_NODE_TYPES.MemberExpression) return;
        const jestFnCall = getJestFnCall(right);
        if (!jestFnCall) return;
        context.report({
          node,
          messageId: 'useJestSpyOn',

          fix(fixer) {
            const leftPropQuote = left.property.type === _experimentalUtils.AST_NODE_TYPES.Identifier ? "'" : '';

            const _jestFnCall$arguments = _slicedToArray(jestFnCall.arguments, 1),
                  arg = _jestFnCall$arguments[0];

            const argSource = arg && context.getSourceCode().getText(arg);
            const mockImplementation = argSource ? `.mockImplementation(${argSource})` : '.mockImplementation()';
            return [fixer.insertTextBefore(left, `jest.spyOn(`), fixer.replaceTextRange([left.object.range[1], left.property.range[0]], `, ${leftPropQuote}`), fixer.replaceTextRange([left.property.range[1], jestFnCall.range[1]], `${leftPropQuote})${mockImplementation}`)];
          }

        });
      }

    };
  }

});

exports.default = _default;