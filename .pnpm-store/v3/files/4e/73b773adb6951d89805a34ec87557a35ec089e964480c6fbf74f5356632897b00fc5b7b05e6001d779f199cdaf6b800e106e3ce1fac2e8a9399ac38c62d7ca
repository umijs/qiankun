"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _ariaQuery = require("aria-query");
var _jsxAstUtils = require("jsx-ast-utils");
var _getElementType = _interopRequireDefault(require("../util/getElementType"));
var _schemas = require("../util/schemas");
var errorMessage = 'Use {{tag}} instead of the "{{role}}" role to ensure accessibility across all devices.';
var schema = (0, _schemas.generateObjSchema)();
var formatTag = function formatTag(tag) {
  if (!tag.attributes) {
    return "<".concat(tag.name, ">");
  }
  var _tag$attributes = (0, _slicedToArray2["default"])(tag.attributes, 1),
    attribute = _tag$attributes[0];
  var value = attribute.value ? "\"".concat(attribute.value, "\"") : '...';
  return "<".concat(tag.name, " ").concat(attribute.name, "=").concat(value, ">");
};
var getLastPropValue = function getLastPropValue(rawProp) {
  var propValue = (0, _jsxAstUtils.getPropValue)(rawProp);
  if (!propValue) {
    return propValue;
  }
  var lastSpaceIndex = propValue.lastIndexOf(' ');
  return lastSpaceIndex === -1 ? propValue : propValue.substring(lastSpaceIndex + 1);
};
var _default = {
  meta: {
    docs: {
      description: 'Enforces using semantic DOM elements over the ARIA `role` property.',
      url: 'https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/prefer-tag-over-role.md'
    },
    schema: [schema]
  },
  create: function create(context) {
    var elementType = (0, _getElementType["default"])(context);
    return {
      JSXOpeningElement: function JSXOpeningElement(node) {
        var role = getLastPropValue((0, _jsxAstUtils.getProp)(node.attributes, 'role'));
        if (!role) {
          return;
        }
        var matchedTagsSet = _ariaQuery.roleElements.get(role);
        if (!matchedTagsSet) {
          return;
        }
        var matchedTags = Array.from(matchedTagsSet);
        if (matchedTags.some(function (matchedTag) {
          return matchedTag.name === elementType(node);
        })) {
          return;
        }
        context.report({
          data: {
            tag: matchedTags.length === 1 ? formatTag(matchedTags[0]) : [matchedTags.slice(0, matchedTags.length - 1).map(formatTag).join(', '), formatTag(matchedTags[matchedTags.length - 1])].join(', or '),
            role
          },
          node,
          message: errorMessage
        });
      }
    };
  }
};
exports["default"] = _default;
module.exports = exports.default;