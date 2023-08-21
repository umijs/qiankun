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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

class Cache {
  constructor(compilation) {
    this.cache = compilation.getCache('TerserWebpackPlugin');
  }

  get(cacheData) {
    var _this = this;

    return _asyncToGenerator(function* () {
      // eslint-disable-next-line no-param-reassign
      cacheData.eTag = cacheData.eTag || Array.isArray(cacheData.inputSource) ? cacheData.inputSource.map(item => _this.cache.getLazyHashedEtag(item)).reduce((previousValue, currentValue) => _this.cache.mergeEtags(previousValue, currentValue)) : _this.cache.getLazyHashedEtag(cacheData.inputSource);
      return _this.cache.getPromise(cacheData.name, cacheData.eTag);
    })();
  }

  store(cacheData) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let data;

      if (cacheData.target === 'comments') {
        data = cacheData.output;
      } else {
        data = {
          source: cacheData.source,
          extractedCommentsSource: cacheData.extractedCommentsSource,
          commentsFilename: cacheData.commentsFilename
        };
      }

      return _this2.cache.storePromise(cacheData.name, cacheData.eTag, data);
    })();
  }

}

exports.default = Cache;