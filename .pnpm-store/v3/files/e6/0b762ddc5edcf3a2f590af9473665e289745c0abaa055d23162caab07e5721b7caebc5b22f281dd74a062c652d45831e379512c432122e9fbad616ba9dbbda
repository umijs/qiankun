"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = table;
function _unistUtilVisit() {
  const data = _interopRequireDefault(require("unist-util-visit"));
  _unistUtilVisit = function _unistUtilVisit() {
    return data;
  };
  return data;
}
function _hastUtilIsElement() {
  const data = _interopRequireDefault(require("hast-util-is-element"));
  _hastUtilIsElement = function _hastUtilIsElement() {
    return data;
  };
  return data;
}
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * rehype plugin to handle table element to component
 */
function table() {
  return ast => {
    (0, _unistUtilVisit().default)(ast, 'element', node => {
      if ((0, _hastUtilIsElement().default)(node, 'table')) {
        node.tagName = 'Table';
      }
    });
  };
}