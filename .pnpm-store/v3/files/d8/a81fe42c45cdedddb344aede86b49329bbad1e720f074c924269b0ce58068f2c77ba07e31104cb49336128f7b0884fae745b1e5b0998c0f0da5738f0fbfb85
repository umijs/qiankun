"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
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

function visitor(node) {
  // wrap all noddes except previewer nodes into markdown elements for isolate styles
  node.children = node.children.reduce((result, item) => {
    // push wrapper element when first loop or the prev node is previewer node
    if (!result.length || result[result.length - 1].previewer) {
      result.push({
        type: 'element',
        tagName: 'div',
        properties: {
          className: this.className
        },
        children: []
      });
    }

    if (item.previewer) {
      // push item directly if it is previewer node
      result.push(item);
    } else {
      // push item into wrapper element if it is not previewer node
      result[result.length - 1].children.push(item);
    }

    return result;
  }, []);
}

var _default = (options = {}) => ast => {
  (0, _unistUtilVisit().default)(ast, 'root', visitor.bind({
    className: options.className || 'markdown'
  }));
};

exports.default = _default;