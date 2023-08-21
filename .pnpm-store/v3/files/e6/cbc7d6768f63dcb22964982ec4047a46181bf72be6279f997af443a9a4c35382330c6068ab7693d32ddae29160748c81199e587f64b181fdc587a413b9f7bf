"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _remark = _interopRequireDefault(require("./remark"));
var _cache = _interopRequireDefault(require("../utils/cache"));
var _yaml = _interopRequireDefault(require("../utils/yaml"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
const cachers = {
  markdown: new _cache.default()
};
var _default = {
  /**
   * transform markdown to jsx & metas
   * @param raw         raw content
   * @param fileAbsPath source file path
   * @param opts        transform options
   */
  markdown(raw, fileAbsPath, {
    type = 'jsx',
    cacheKey = fileAbsPath,
    throwError,
    masterKey
  } = {}) {
    // use cache first
    let result = cacheKey && cachers.markdown.get(cacheKey);
    if (!result) {
      try {
        result = {
          value: (0, _remark.default)(raw, fileAbsPath, type, masterKey)
        };
      } catch (error) {
        // return empty result & cache error
        result = {
          value: {
            contents: '',
            data: {}
          },
          error
        };
      } finally {
        if (cacheKey) {
          cachers.markdown.add(fileAbsPath, result, cacheKey);
        }
      }
    }
    // throw error for webpack loader but not throw for route initialize stage
    if (result.error && throwError) {
      throw result.error;
    }
    return {
      content: result.value.contents,
      meta: result.value.data
    };
  },
  /**
   * split frontmatters & content for code block
   * @param raw   raw content
   */
  code(raw) {
    const _raw$replace$match = raw
      // clear head break lines
      .replace(/^\n\s*/, '')
      // split head comments & remaining code
      .match(/^(\/\*\*[^]*?\n\s*\*\/)?(?:\s|\n)*([^]+)?$/),
      _raw$replace$match2 = _slicedToArray(_raw$replace$match, 3),
      _raw$replace$match2$ = _raw$replace$match2[1],
      comments = _raw$replace$match2$ === void 0 ? '' : _raw$replace$match2$,
      _raw$replace$match2$2 = _raw$replace$match2[2],
      content = _raw$replace$match2$2 === void 0 ? '' : _raw$replace$match2$2;
    const frontmatter = comments
    // clear / from head & foot for comment
    .replace(/^\/|\/$/g, '')
    // remove * from comments
    .replace(/(^|\n)\s*\*+/g, '$1');
    const meta = (0, _yaml.default)(frontmatter);
    return {
      content: Object.keys(meta).length ? content : raw,
      meta
    };
  }
};
exports.default = _default;