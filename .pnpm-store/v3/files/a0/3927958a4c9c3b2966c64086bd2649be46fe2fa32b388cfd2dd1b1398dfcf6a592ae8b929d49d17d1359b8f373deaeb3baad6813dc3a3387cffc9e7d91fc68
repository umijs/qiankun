"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _utils = require("./utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const mocksDirName = '__mocks__';

const isMockPath = path => path.split(_path.posix.sep).includes(mocksDirName);

const isMockImportLiteral = expression => (0, _utils.isStringNode)(expression) && isMockPath((0, _utils.getStringValue)(expression));

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description: 'When using `jest.mock`, your tests (just like the code being tested) should import from `./x`, not `./__mocks__/x`. Not following this rule can lead to confusion, because you will have multiple instances of the mocked module',
      recommended: 'error'
    },
    messages: {
      noManualImport: `Mocks should not be manually imported from a ${mocksDirName} directory. Instead use jest.mock and import from the original module path.`
    },
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source && isMockImportLiteral(node.source)) {
          context.report({
            node,
            messageId: 'noManualImport'
          });
        }
      },

      'CallExpression[callee.name="require"]'(node) {
        const _node$arguments = _slicedToArray(node.arguments, 1),
              arg = _node$arguments[0];

        if (arg && isMockImportLiteral(arg)) {
          context.report({
            node: arg,
            messageId: 'noManualImport'
          });
        }
      }

    };
  }

});

exports.default = _default;