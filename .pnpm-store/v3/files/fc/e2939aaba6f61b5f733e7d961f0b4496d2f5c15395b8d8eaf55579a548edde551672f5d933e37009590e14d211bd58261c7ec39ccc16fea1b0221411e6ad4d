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
function _hastUtilHasProperty() {
  const data = _interopRequireDefault(require("hast-util-has-property"));
  _hastUtilHasProperty = function _hastUtilHasProperty() {
    return data;
  };
  return data;
}
function _hastUtilRaw() {
  const data = _interopRequireDefault(require("hast-util-raw"));
  _hastUtilRaw = function _hastUtilRaw() {
    return data;
  };
  return data;
}
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * detect properties whether has complex value
 * @param props
 */
function hasComplexProp(props) {
  return Object.values(props).some(prop => ['object', 'function'].includes(typeof prop) || Array.isArray(prop));
}
/**
 * rehype plugin for compile raw node to hast
 */
var _default = () => ast => {
  const props = [];
  (0, _unistUtilVisit().default)(ast, node => {
    // workaround to avoid lowercase for React Component tag name
    // mark React Compnoent via dumi-raw prefixer, eg Alert => dumi-raw-alert
    if (typeof node.tagName === 'string' && /^[A-Z]/.test(node.tagName)) {
      node.tagName = `dumi-raw${node.tagName.replace(/[A-Z]/g, s => `-${s.toLowerCase()}`)}`;
    } else if (typeof node.value === 'string' && node.type === 'raw') {
      node.value = node.value.replace(/(<\/?)([A-Z]\w+)/g, (_, prefix, tagName) => {
        return `${prefix}dumi-raw${tagName.replace(/[A-Z]/g, s => `-${s.toLowerCase()}`)}`;
      });
    }
    // workaround to avoid parse React Component properties to string in the raw step
    if (typeof node.properties === 'object' && hasComplexProp(node.properties)) {
      props.push(node.properties);
      node.properties = {
        _index: props.length - 1
      };
    }
    // special process <code />, <code > to <code></code>
    // to avoid non-self-closing exception in the raw step
    if (typeof node.value === 'string' && /<code[^>]*src=/.test(node.value)) {
      node.value = node.value.replace(/ ?\/?>/g, '></code>');
    }
    // special process <API /> for same reason in above
    if (typeof node.value === 'string' && /<dumi-raw-a-p-i/.test(node.value)) {
      node.value = node.value.replace(/ ?\/?>/g, '></dumi-raw-a-p-i>');
    }
  });
  // raw to hast tree
  const parsed = (0, _hastUtilRaw().default)(ast);
  // restore React Component & it's properties
  (0, _unistUtilVisit().default)(parsed, 'element', elm => {
    // restore tag name
    if (/^dumi-raw/.test(elm.tagName)) {
      elm.tagName = elm.tagName.replace('dumi-raw', '').replace(/-([a-z])/g, (_, word) => word.toUpperCase());
    }
    // restore properties from temp array
    if ((0, _hastUtilHasProperty().default)(elm, '_index')) {
      elm.properties = props[elm.properties._index];
    }
  });
  return parsed;
};
exports.default = _default;