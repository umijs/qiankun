"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMailtoURI;

var _trim = _interopRequireDefault(require("./trim"));

var _isEmail = _interopRequireDefault(require("./isEmail"));

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function parseMailtoQueryString(queryString) {
  var allowedParams = new Set(['subject', 'body', 'cc', 'bcc']),
      query = {
    cc: '',
    bcc: ''
  };
  var isParseFailed = false;
  var queryParams = queryString.split('&');

  if (queryParams.length > 4) {
    return false;
  }

  var _iterator = _createForOfIteratorHelper(queryParams),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var q = _step.value;

      var _q$split = q.split('='),
          _q$split2 = _slicedToArray(_q$split, 2),
          key = _q$split2[0],
          value = _q$split2[1]; // checked for invalid and duplicated query params


      if (key && !allowedParams.has(key)) {
        isParseFailed = true;
        break;
      }

      if (value && (key === 'cc' || key === 'bcc')) {
        query[key] = value;
      }

      if (key) {
        allowedParams.delete(key);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return isParseFailed ? false : query;
}

function isMailtoURI(url, options) {
  (0, _assertString.default)(url);

  if (url.indexOf('mailto:') !== 0) {
    return false;
  }

  var _url$replace$split = url.replace('mailto:', '').split('?'),
      _url$replace$split2 = _slicedToArray(_url$replace$split, 2),
      _url$replace$split2$ = _url$replace$split2[0],
      to = _url$replace$split2$ === void 0 ? '' : _url$replace$split2$,
      _url$replace$split2$2 = _url$replace$split2[1],
      queryString = _url$replace$split2$2 === void 0 ? '' : _url$replace$split2$2;

  if (!to && !queryString) {
    return true;
  }

  var query = parseMailtoQueryString(queryString);

  if (!query) {
    return false;
  }

  return "".concat(to, ",").concat(query.cc, ",").concat(query.bcc).split(',').every(function (email) {
    email = (0, _trim.default)(email, ' ');

    if (email) {
      return (0, _isEmail.default)(email, options);
    }

    return true;
  });
}

module.exports = exports.default;
module.exports.default = exports.default;