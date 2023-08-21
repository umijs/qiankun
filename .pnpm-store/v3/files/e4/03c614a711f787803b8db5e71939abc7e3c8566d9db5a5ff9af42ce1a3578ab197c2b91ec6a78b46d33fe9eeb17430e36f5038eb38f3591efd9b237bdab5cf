"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
var _transformer = _interopRequireDefault(require("../transformer"));
const _excluded = ["demos"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/**
 * extract Front Matter config from markdown file
 */
var _default = fileAbsPath => {
  const _path$parse = _path().default.parse(fileAbsPath),
    ext = _path$parse.ext;
  const content = _fs().default.readFileSync(fileAbsPath, 'utf8').toString();
  let meta;
  switch (ext) {
    case '.tsx':
    case '.jsx':
    case '.ts':
    case '.js':
      var _transformer$code = _transformer.default.code(content);
      meta = _transformer$code.meta;
      break;
    case '.md':
      var _transformer$markdown = _transformer.default.markdown(content, fileAbsPath);
      meta = _transformer$markdown.meta;
      break;
    default:
  }
  // remove useless demo frontmatters
  const _meta = meta,
    demos = _meta.demos,
    result = _objectWithoutProperties(_meta, _excluded);
  if (demos === null || demos === void 0 ? void 0 : demos.find(item => !item.inline)) {
    result.hasPreviewer = true;
  }
  return result;
};
exports.default = _default;