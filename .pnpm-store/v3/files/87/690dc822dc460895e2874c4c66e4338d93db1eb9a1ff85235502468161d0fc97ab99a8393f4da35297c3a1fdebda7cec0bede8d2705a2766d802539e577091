"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = img;
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
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
function _hastUtilHasProperty() {
  const data = _interopRequireDefault(require("hast-util-has-property"));
  _hastUtilHasProperty = function _hastUtilHasProperty() {
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
function isRelativeUrl(url) {
  return typeof url === 'string' && !/^(?:(?:blob:)?\w+:)?\/\//.test(url) && !_path().default.isAbsolute(url);
}
/**
 * rehype plugin to handle img source from local
 */
function img() {
  return ast => {
    (0, _unistUtilVisit().default)(ast, 'element', node => {
      if ((0, _hastUtilIsElement().default)(node, 'img') && (0, _hastUtilHasProperty().default)(node, 'src')) {
        const src = node.properties.src;
        if (isRelativeUrl(src)) {
          // use wrapper element to workaround for skip props escape
          // https://github.com/mapbox/jsxtreme-markdown/blob/main/packages/hast-util-to-jsx/index.js#L159
          // eslint-disable-next-line no-new-wrappers
          node.properties.src = new String(`require('${decodeURI(src)}')`);
        }
      }
    });
  };
}