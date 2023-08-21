"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prevents exports from test files. If a file has at least 1 test in it, then this rule will prevent exports.',
      recommended: false
    },
    messages: {
      unexpectedExport: `Do not export from a test file.`
    },
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    const exportNodes = [];
    let hasTestCase = false;
    return {
      'Program:exit'() {
        if (hasTestCase && exportNodes.length > 0) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = exportNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              const node = _step.value;
              context.report({
                node,
                messageId: 'unexpectedExport'
              });
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      },

      CallExpression(node) {
        if ((0, _utils.isTestCase)(node)) {
          hasTestCase = true;
        }
      },

      'ExportNamedDeclaration, ExportDefaultDeclaration'(node) {
        exportNodes.push(node);
      },

      'AssignmentExpression > MemberExpression'(node) {
        let object = node.object,
            property = node.property;

        if (object.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression) {
          var _object = object;
          object = _object.object;
          property = _object.property;
        }

        if ('name' in object && object.name === 'module' && property.type === _experimentalUtils.AST_NODE_TYPES.Identifier && /^exports?$/.test(property.name)) {
          exportNodes.push(node);
        }
      }

    };
  }

});

exports.default = _default;