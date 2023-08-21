"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mdComponent;
exports.registerMdComponent = registerMdComponent;
function _hastUtilIsElement() {
  const data = _interopRequireDefault(require("hast-util-is-element"));
  _hastUtilIsElement = function _hastUtilIsElement() {
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const markdownComponents = [];
function registerMdComponent(comp) {
  const target = markdownComponents.find(item => item.name === comp.name);
  if (target) {
    // replace the existed one
    Object.assign(target, comp);
  } else {
    markdownComponents.push(comp);
  }
}
/**
 * remark plugin for parsing the customize markdwon components
 */
function mdComponent() {
  return (ast, vFile) => {
    (0, _unistUtilVisit().default)(ast, 'element', (node, i, parent) => {
      const componentNames = markdownComponents.map(a => a.name);
      if ((0, _hastUtilIsElement().default)(node, componentNames) && !node._dumi_parsed) {
        const target = markdownComponents.find(item => item.name === node.tagName);
        // mark this node as a parsed node by dumi
        node._dumi_parsed = true;
        return target.compiler.call(this, node, i, parent, vFile);
      }
    });
  };
}