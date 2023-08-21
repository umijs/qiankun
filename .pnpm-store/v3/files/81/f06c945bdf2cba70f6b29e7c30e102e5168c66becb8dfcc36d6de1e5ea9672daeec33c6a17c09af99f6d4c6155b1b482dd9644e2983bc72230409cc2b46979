"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _hastUtilToJsx() {
  const data = _interopRequireDefault(require("@mapbox/hast-util-to-jsx"));
  _hastUtilToJsx = function _hastUtilToJsx() {
    return data;
  };
  return data;
}
function _unistUtilVisit() {
  const data = _interopRequireDefault(require("unist-util-visit"));
  _unistUtilVisit = function _unistUtilVisit() {
    return data;
  };
  return data;
}
var _utils = require("../utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * rehype compiler for compile hast to jsx
 */
var jsxify = function jsxify() {
  this.Compiler = function compiler(ast) {
    // format props for JSX element
    (0, _unistUtilVisit().default)(ast, 'element', node => {
      node.properties = (0, _utils.formatJSXProps)(node.properties);
    });
    let JSX = (0, _hastUtilToJsx().default)(ast, {
      wrapper: 'fragment'
    }) || '';
    // append previewProps for previewer
    JSX = JSX.replace(/data-previewer-props-replaced="([^"]+)"/g, "{...DUMI_ALL_DEMOS['$1'].previewerProps}");
    return JSX;
  };
};
exports.default = jsxify;