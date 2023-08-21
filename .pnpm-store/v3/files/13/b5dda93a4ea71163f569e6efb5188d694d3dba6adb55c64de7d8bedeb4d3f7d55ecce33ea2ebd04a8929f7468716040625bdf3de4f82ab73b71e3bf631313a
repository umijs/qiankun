"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
var _transformer = _interopRequireDefault(require("../transformer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/**
 * loader for strip frontmatter from source code
 * @param raw   source
 */
function loader(_x) {
  return _loader.apply(this, arguments);
}
function _loader() {
  _loader = _asyncToGenerator(function* (raw) {
    const json = JSON.stringify(_transformer.default.code(raw).content.trimEnd())
    // refer: https://bugs.chromium.org/p/v8/issues/detail?id=1907#c6
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    return `export default ${json}`;
  });
  return _loader.apply(this, arguments);
}