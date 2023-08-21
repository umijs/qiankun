"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BUILD_STATUS = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

var _constants = require("./constants");

var _getDepVersion = require("./getDepVersion");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const debug = (0, _utils().createDebug)('umi:mfsu:DepInfo');
let BUILD_STATUS;
exports.BUILD_STATUS = BUILD_STATUS;

(function (BUILD_STATUS) {
  BUILD_STATUS[BUILD_STATUS["IDLE"] = 0] = "IDLE";
  BUILD_STATUS[BUILD_STATUS["BUILDING"] = 1] = "BUILDING";
  BUILD_STATUS[BUILD_STATUS["SUCCESS"] = 2] = "SUCCESS";
  BUILD_STATUS[BUILD_STATUS["FAIL"] = 3] = "FAIL";
})(BUILD_STATUS || (exports.BUILD_STATUS = BUILD_STATUS = {}));

class DepInfo {
  constructor(opts) {
    this.data = void 0;
    this.cacheDir = void 0;
    this.cwd = void 0;
    this.mode = void 0;
    this.cachePath = void 0;
    this.webpackAlias = void 0;
    this.api = void 0;
    this.debouncedWriteCache = void 0;
    this.api = opts.api;
    this.cwd = opts.cwd;
    this.cacheDir = opts.tmpDir;
    this.mode = opts.mode;
    this.webpackAlias = opts.webpackAlias || {};
    this.cachePath = (0, _path().join)(this.cacheDir, _constants.DEP_INFO_CACHE_FILE);
    this.debouncedWriteCache = _utils().lodash.debounce(this.writeCache.bind(this), 300);
    (0, _assert().default)(['development', 'production'].includes(this.mode), `[MFSU] Unsupported mode ${this.mode}`);
    this.data = {
      deps: {},
      config: {},
      tmpDeps: {}
    };
  }

  loadCache() {
    const path = this.cachePath;

    try {
      if ((0, _fs().existsSync)(path)) {
        debug('cache exists');
        const data = JSON.parse((0, _fs().readFileSync)(path, 'utf-8'));
        (0, _assert().default)(data.deps, `[MFSU] cache parse failed, deps not found.`);
        const normalizedDeps = {};
        Object.keys(data.deps).forEach(key => {
          const normalizeKey = key.replace(_constants.CWD, (0, _utils().winPath)(this.api.cwd));
          normalizedDeps[normalizeKey] = data.deps[key];
        });
        data.deps = normalizedDeps;
        const normalizedTmpDeps = {};
        Object.keys(data.tmpDeps || {}).forEach(key => {
          const normalizeKey = key.replace(_constants.CWD, (0, _utils().winPath)(this.api.cwd));
          normalizedDeps[normalizeKey] = data.tmpDeps[key];
        });
        data.tmpDeps = normalizedTmpDeps;
        this.data = data;
      }
    } catch (e) {
      throw new Error(`${e.message}, try to remove cache file and retry.`);
    }
  }

  addTmpDep(dep, from) {
    debug(`add tmp dep ${dep}`);

    if (typeof dep === 'object' && dep.key && dep.version) {
      this.setTmpDep(_objectSpread(_objectSpread({}, dep), {}, {
        from
      }));
    } else if (typeof dep === 'string') {
      const version = (0, _getDepVersion.getDepVersion)({
        dep,
        cwd: this.cwd,
        webpackAlias: this.webpackAlias,
        from
      });
      this.setTmpDep({
        key: dep,
        version,
        from
      });
    }
  }

  setTmpDep(opts) {
    if (this.data.tmpDeps[opts.key] && this.data.tmpDeps[opts.key] !== opts.version) {
      throw new Error(`[MFSU] dep ${opts.key} conflicts of ${opts.version} and ${this.data.tmpDeps[opts.key]}`);
    }

    this.data.tmpDeps[opts.key] = opts.version;
    this.debouncedWriteCache();
  }

  loadTmpDeps() {
    const shouldBuild = this.shouldBuild();

    if (shouldBuild) {
      Object.assign(this.data.deps, this.data.tmpDeps);
      this.data.config = this.getConfig(); // clear tmp deps

      this.data.tmpDeps = {};
    }

    return {
      shouldBuild
    };
  }

  shouldBuild() {
    debug('tmpDeps', this.data.tmpDeps); // 没有变更，不 build

    if (!Object.keys(this.data.tmpDeps).length) {
      return false;
    } // 没有 remoteEntry 时始终预编译依赖


    if (!(0, _fs().existsSync)((0, _path().join)(this.cacheDir, `${_constants.MF_VA_PREFIX}remoteEntry.js`))) {
      return true;
    } // 配置变更后，强制 build


    if (!_utils().lodash.isEqual(this.getConfig(), this.data.config)) {
      debug(`config changed, new: ${JSON.stringify(this.getConfig())}, origin: ${JSON.stringify(this.data.config)}`);
      return true;
    }

    debug('this.data.deps', this.data.deps);

    if (this.mode === 'production') {
      return !_utils().lodash.isEqual(this.data.tmpDeps, this.data.deps);
    } else {
      for (var _i = 0, _Object$keys = Object.keys(this.data.tmpDeps); _i < _Object$keys.length; _i++) {
        const key = _Object$keys[_i];

        // 新增或修改
        if (this.data.deps[key] !== this.data.tmpDeps[key]) {
          return true;
        }
      }

      return false;
    }
  }

  getConfig() {
    return {
      // 会触发依赖重新编译的配置
      theme: this.api.config.theme || {},
      externals: this.api.config.externals || {},
      runtimePublicPath: this.api.config.runtimePublicPath || false,
      // umi 版本变更后需要重新编译一次
      // TODO: ModuleGraph 上线后可以删掉这个
      umiVersion: process.env.UMI_VERSION,
      bigfishVersion: process.env.BIGFISH_VERSION || 'null'
    };
  }

  writeCache() {
    const noAbsDeps = {};
    Object.keys(this.data.deps).forEach(depName => {
      const noAbsDepName = depName.replace((0, _utils().winPath)(this.api.cwd), _constants.CWD);
      noAbsDeps[noAbsDepName] = this.data.deps[depName];
    });
    const content = JSON.stringify(_objectSpread(_objectSpread({}, this.data), {}, {
      deps: noAbsDeps
    }), null, 2);
    (0, _fs().writeFileSync)(this.cachePath, content, 'utf-8');
  }

}

exports.default = DepInfo;