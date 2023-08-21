"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _demo = require("../../demo");
var _utils = require("../../utils");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * builtin previewer transformer
 */
const builtinPreviewerTransformer = ({
  mdAbsPath,
  node
}) => {
  var _node$properties$meta;
  const isExternalDemo = Boolean(node.properties.filePath);
  const fileAbsPath = node.properties.filePath || mdAbsPath;
  let files = {};
  let dependencies = {};
  // collect third-party dependencies and locale file dependencies for demo
  // FIXME: handle frontmatter in the head of external demo code
  if (!((_node$properties$meta = node.properties.meta) === null || _node$properties$meta === void 0 ? void 0 : _node$properties$meta.inline)) {
    try {
      var _getDepsForDemo = (0, _demo.getDepsForDemo)(node.properties.source, {
        isTSX: /^tsx?$/.test(node.properties.lang),
        fileAbsPath
      });
      files = _getDepsForDemo.files;
      dependencies = _getDepsForDemo.dependencies;
    } catch (_unused) {
      /* nothing */
    }
  }
  return {
    // previewer props
    previewerProps: {
      sources: _objectSpread({
        _: {
          [node.properties.lang]: isExternalDemo ? (0, _utils.encodeHoistImport)(node.properties.filePath) : node.properties.source
        }
      }, Object.keys(files).reduce((result, file) => _objectSpread(_objectSpread({}, result), {}, {
        [file]: {
          import: files[file].import,
          path: files[file].fileAbsPath
        }
      }), {})),
      dependencies
    }
  };
};
var _default = {
  type: 'builtin',
  fn: builtinPreviewerTransformer
};
exports.default = _default;