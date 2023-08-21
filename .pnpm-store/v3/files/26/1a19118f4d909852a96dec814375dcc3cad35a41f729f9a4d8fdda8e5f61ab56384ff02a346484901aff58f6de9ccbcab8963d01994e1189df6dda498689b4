"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _jsxAstUtils = require("jsx-ast-utils");
var _getTabIndex = _interopRequireDefault(require("./getTabIndex"));
var _isInteractiveElement = _interopRequireDefault(require("./isInteractiveElement"));
/**
 * Returns boolean indicating whether an element appears in tab focus.
 * Identifies an element as focusable if it is an interactive element, or an element with a tabIndex greater than or equal to 0.
 */
function isFocusable(type, attributes) {
  var tabIndex = (0, _getTabIndex["default"])((0, _jsxAstUtils.getProp)(attributes, 'tabIndex'));
  if ((0, _isInteractiveElement["default"])(type, attributes)) {
    return tabIndex === undefined || tabIndex >= 0;
  }
  return tabIndex >= 0;
}
var _default = isFocusable;
exports["default"] = _default;
module.exports = exports.default;