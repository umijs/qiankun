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

function _os() {
  const data = _interopRequireDefault(require("os"));

  _os = function _os() {
    return data;
  };

  return data;
}

function _cacache() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/cacache"));

  _cacache = function _cacache() {
    return data;
  };

  return data;
}

function _findCacheDir() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/find-cache-dir"));

  _findCacheDir = function _findCacheDir() {
    return data;
  };

  return data;
}

function _serializeJavascript() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/serialize-javascript"));

  _serializeJavascript = function _serializeJavascript() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

class Webpack4Cache {
  constructor(compilation, options, weakCache) {
    this.cache = options.cache === true ? Webpack4Cache.getCacheDirectory() : options.cache;
    this.weakCache = weakCache;
  }

  static getCacheDirectory() {
    return (0, _findCacheDir().default)({
      name: 'terser-webpack-plugin'
    }) || _os().default.tmpdir();
  }

  get(cacheData, {
    RawSource,
    ConcatSource,
    SourceMapSource
  }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!_this.cache) {
        // eslint-disable-next-line no-undefined
        return undefined;
      }

      const weakOutput = _this.weakCache.get(cacheData.inputSource);

      if (weakOutput) {
        return weakOutput;
      } // eslint-disable-next-line no-param-reassign


      cacheData.cacheIdent = cacheData.cacheIdent || (0, _serializeJavascript().default)(cacheData.cacheKeys);
      let cachedResult;

      try {
        cachedResult = yield _cacache().default.get(_this.cache, cacheData.cacheIdent);
      } catch (ignoreError) {
        // eslint-disable-next-line no-undefined
        return undefined;
      }

      cachedResult = JSON.parse(cachedResult.data);

      if (cachedResult.target === 'comments') {
        return new ConcatSource(cachedResult.value);
      }

      const _cachedResult = cachedResult,
            code = _cachedResult.code,
            name = _cachedResult.name,
            map = _cachedResult.map,
            input = _cachedResult.input,
            inputSourceMap = _cachedResult.inputSourceMap,
            extractedComments = _cachedResult.extractedComments,
            banner = _cachedResult.banner,
            shebang = _cachedResult.shebang;

      if (map) {
        cachedResult.source = new SourceMapSource(code, name, map, input, inputSourceMap, true);
      } else {
        cachedResult.source = new RawSource(code);
      }

      if (banner) {
        cachedResult.source = new ConcatSource(shebang ? `${shebang}\n` : '', `/*! ${banner} */\n`, cachedResult.source);
      }

      if (extractedComments) {
        cachedResult.extractedCommentsSource = new RawSource(extractedComments);
      }

      return cachedResult;
    })();
  }

  store(cacheData) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.cache) {
        // eslint-disable-next-line no-undefined
        return undefined;
      }

      if (!_this2.weakCache.has(cacheData.inputSource)) {
        if (cacheData.target === 'comments') {
          _this2.weakCache.set(cacheData.inputSource, cacheData.output);
        } else {
          _this2.weakCache.set(cacheData.inputSource, cacheData);
        }
      }

      let data;

      if (cacheData.target === 'comments') {
        data = {
          target: cacheData.target,
          value: cacheData.output.source()
        };
      } else {
        data = {
          code: cacheData.code,
          name: cacheData.name,
          map: cacheData.map,
          input: cacheData.input,
          inputSourceMap: cacheData.inputSourceMap,
          banner: cacheData.banner,
          shebang: cacheData.shebang
        };

        if (cacheData.extractedCommentsSource) {
          data.extractedComments = cacheData.extractedCommentsSource.source();
          data.commentsFilename = cacheData.commentsFilename;
        }
      }

      return _cacache().default.put(_this2.cache, cacheData.cacheIdent, JSON.stringify(data));
    })();
  }

}

exports.default = Webpack4Cache;