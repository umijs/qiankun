"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _unistUtilVisit() {
  const data = _interopRequireDefault(require("unist-util-visit"));
  _unistUtilVisit = function _unistUtilVisit() {
    return data;
  };
  return data;
}
var _loader = require("../../theme/loader");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * detect node whether solo rendered node
 * @note  solo node need not to wrap by .markdown container
 * @param node  node
 */
function isSoloNode(node) {
  return Boolean(node.previewer || node.embed);
}
/**
 * detect node whether line break node
 * @param node  node
 */
function isLineBreakNode(node) {
  return node.type === 'text' && /^[\n\r]+$/.test(node.value);
}
/**
 * detect node whether .markdown wrapper
 * @param node      node
 * @param className wrapper css class name
 */
function isWrapperNode(node, className) {
  var _node$properties;
  return ((_node$properties = node.properties) === null || _node$properties === void 0 ? void 0 : _node$properties.className) === className;
}
/**
 * detect node whether user global React component
 * @param node
 */
function isReactComponent(node) {
  return /^[A-Z].+/.test(node.tagName) && !_loader.REQUIRED_THEME_BUILTINS.includes(node.tagName) &&
  // FIXME
  !['AnchorLink', 'NavLink', 'Link'].includes(node.tagName);
}
const visitor = function visitor(node) {
  // wrap all noddes except previewer nodes into markdown elements for isolate styles
  node.children = node.children.reduce((result, item) => {
    var _item$children;
    let prevSibling = result[result.length - 1];
    if (isSoloNode(item) || isLineBreakNode(item) && (!prevSibling || !isWrapperNode(prevSibling, this.className))) {
      // push item directly if it is solo node or is not break line node before content
      result.push(item);
    } else if (
    // <p><Test></Test></p> or <Test></Test>
    item.tagName === 'p' && ((_item$children = item.children) === null || _item$children === void 0 ? void 0 : _item$children.length) === 1 && isReactComponent(item.children[0]) || isReactComponent(item)) {
      var _item$children2;
      // solo for user custom component
      result.push(item.tagName === 'p' ? (_item$children2 = item.children) === null || _item$children2 === void 0 ? void 0 : _item$children2[0] : item);
    } else {
      // push wrapper element when first loop or the prev node is solo node
      if (!prevSibling || isSoloNode(prevSibling) || isLineBreakNode(prevSibling)) {
        prevSibling = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: this.className
          },
          children: []
        };
        result.push(prevSibling);
      }
      // push item into wrapper element if it is not solo node
      prevSibling.children.push(item);
    }
    return result;
  }, []);
};
var _default = (options = {}) => ast => {
  (0, _unistUtilVisit().default)(ast, 'root', visitor.bind({
    className: options.className || 'markdown'
  }));
};
exports.default = _default;