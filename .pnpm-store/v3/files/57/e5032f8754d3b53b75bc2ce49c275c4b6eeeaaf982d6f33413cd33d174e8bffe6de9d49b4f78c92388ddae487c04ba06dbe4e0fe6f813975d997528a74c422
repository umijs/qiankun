"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = code;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
    return data;
  };
  return data;
}
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
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
function _hastUtilHasProperty() {
  const data = _interopRequireDefault(require("hast-util-has-property"));
  _hastUtilHasProperty = function _hastUtilHasProperty() {
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
var _utils = require("./utils");
var _previewer = require("./previewer");
var _moduleResolver = require("../../utils/moduleResolver");
const _excluded = ["src"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/**
 * remark plugin for parse code tag to external demo
 */
function code() {
  return ast => {
    (0, _unistUtilVisit().default)(ast, 'element', (node, index, parent) => {
      if ((0, _hastUtilIsElement().default)(node, 'code') && (0, _hastUtilHasProperty().default)(node, 'src')) {
        const hasCustomTransformer = _previewer.previewerTransforms.length > 1;
        const _node$properties = node.properties,
          src = _node$properties.src,
          attrs = _objectWithoutProperties(_node$properties, _excluded);
        const props = {
          source: '',
          lang: _path().default.extname(src).slice(1),
          filePath: _path().default.join(_path().default.dirname(this.data('fileAbsPath')), src)
        };
        const parsedAttrs = (0, _utils.parseElmAttrToProps)(attrs);
        try {
          props.filePath = (0, _moduleResolver.getModuleResolvePath)(_objectSpread({
            basePath: this.data('fileAbsPath'),
            sourcePath: src,
            // allow set unresolved src then resolve by custom transformer
            silent: hasCustomTransformer
          }, hasCustomTransformer ? {} : {
            extensions: ['.tsx', '.jsx']
          }));
          props.source = _fs().default.readFileSync(props.filePath, 'utf8').toString();
          props.lang = _path().default.extname(props.filePath).slice(1);
        } catch (err) {
          /* istanbul ignore next */
          if (!hasCustomTransformer) {
            throw err;
          }
        }
        // replace original node
        parent.children.splice(index, 1, {
          type: 'element',
          tagName: 'div',
          position: node.position,
          properties: _objectSpread(_objectSpread({
            type: 'previewer'
          }, props), {}, {
            src,
            meta: _objectSpread({}, parsedAttrs)
          })
        });
      }
    });
  };
}