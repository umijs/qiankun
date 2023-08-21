"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBundleAndConfigs = getBundleAndConfigs;
exports.cleanTmpPathExceptCache = cleanTmpPathExceptCache;
exports.printFileSizes = printFileSizes;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _bundlerWebpack() {
  const data = require("@umijs/bundler-webpack");

  _bundlerWebpack = function _bundlerWebpack() {
    return data;
  };

  return data;
}

function _types() {
  const data = require("@umijs/types");

  _types = function _types() {
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

function _zlib() {
  const data = _interopRequireDefault(require("zlib"));

  _zlib = function _zlib() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getBundleAndConfigs(_x) {
  return _getBundleAndConfigs.apply(this, arguments);
}

function _getBundleAndConfigs() {
  _getBundleAndConfigs = _asyncToGenerator(function* ({
    api,
    mfsu,
    port
  }) {
    // bundler
    const Bundler = yield api.applyPlugins({
      type: api.ApplyPluginsType.modify,
      key: 'modifyBundler',
      initialValue: _bundlerWebpack().Bundler
    });
    const bundleImplementor = yield api.applyPlugins({
      key: 'modifyBundleImplementor',
      type: api.ApplyPluginsType.modify,
      initialValue: undefined
    }); // get config

    function getConfig(_x2) {
      return _getConfig.apply(this, arguments);
    }

    function _getConfig() {
      _getConfig = _asyncToGenerator(function* ({
        type
      }) {
        const env = api.env === 'production' ? 'production' : 'development';
        const getConfigOpts = yield api.applyPlugins({
          type: api.ApplyPluginsType.modify,
          key: 'modifyBundleConfigOpts',
          initialValue: {
            env,
            type,
            port,
            mfsu,
            hot: type === _types().BundlerConfigType.csr && process.env.HMR !== 'none',
            entry: {
              umi: (0, _path().join)(api.paths.absTmpPath, 'umi.ts')
            },
            // @ts-ignore
            bundleImplementor,

            modifyBabelOpts(opts, args) {
              return _asyncToGenerator(function* () {
                return yield api.applyPlugins({
                  type: api.ApplyPluginsType.modify,
                  key: 'modifyBabelOpts',
                  initialValue: opts,
                  args
                });
              })();
            },

            modifyBabelPresetOpts(opts, args) {
              return _asyncToGenerator(function* () {
                return yield api.applyPlugins({
                  type: api.ApplyPluginsType.modify,
                  key: 'modifyBabelPresetOpts',
                  initialValue: opts,
                  args
                });
              })();
            },

            chainWebpack(webpackConfig, opts) {
              return _asyncToGenerator(function* () {
                return yield api.applyPlugins({
                  type: api.ApplyPluginsType.modify,
                  key: 'chainWebpack',
                  initialValue: webpackConfig,
                  args: _objectSpread({}, opts)
                });
              })();
            }

          },
          args: _objectSpread(_objectSpread({}, bundlerArgs), {}, {
            type,
            mfsu
          })
        });
        return yield api.applyPlugins({
          type: api.ApplyPluginsType.modify,
          key: 'modifyBundleConfig',
          initialValue: yield bundler.getConfig(getConfigOpts),
          args: _objectSpread(_objectSpread({}, bundlerArgs), {}, {
            type,
            mfsu
          })
        });
      });
      return _getConfig.apply(this, arguments);
    }

    const bundler = new Bundler({
      cwd: api.cwd,
      config: api.config
    });
    const bundlerArgs = {
      env: api.env,
      bundler: {
        id: Bundler.id,
        version: Bundler.version
      }
    };
    const bundleConfigs = yield api.applyPlugins({
      type: api.ApplyPluginsType.modify,
      key: 'modifyBundleConfigs',
      initialValue: [yield getConfig({
        type: _types().BundlerConfigType.csr
      })].filter(Boolean),
      args: _objectSpread(_objectSpread({}, bundlerArgs), {}, {
        getConfig
      })
    });
    return {
      bundleImplementor,
      bundler,
      bundleConfigs
    };
  });
  return _getBundleAndConfigs.apply(this, arguments);
}

function cleanTmpPathExceptCache({
  absTmpPath
}) {
  if (!(0, _fs().existsSync)(absTmpPath)) return;
  (0, _fs().readdirSync)(absTmpPath).forEach(file => {
    if (file === `.cache`) return;

    _utils().rimraf.sync((0, _path().join)(absTmpPath, file));
  });
} // These sizes are pretty large. We'll warn for bundles exceeding them.


const WARN_AFTER_BUNDLE_GZIP_SIZE = 1.8 * 1024 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1 * 1024 * 1024;

function printFileSizes(stats, dir) {
  var _json$children;

  const ui = require('@umijs/deps/compiled/cliui')({
    width: 80
  });

  const json = stats.toJson({
    hash: false,
    modules: false,
    chunks: false
  });

  const filesize = bytes => {
    bytes = Math.abs(bytes);
    const radix = 1024;
    const unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let loop = 0; // calculate

    while (bytes >= radix) {
      bytes /= radix;
      ++loop;
    }

    return `${bytes.toFixed(1)} ${unit[loop]}`;
  };

  const assets = json.assets ? json.assets : // @ts-ignore
  json === null || json === void 0 ? void 0 : (_json$children = json.children) === null || _json$children === void 0 ? void 0 : _json$children.reduce((acc, child) => acc.concat(child === null || child === void 0 ? void 0 : child.assets), []);
  const seenNames = new Map();

  const isJS = val => /\.js$/.test(val);

  const isCSS = val => /\.css$/.test(val);

  const orderedAssets = assets === null || assets === void 0 ? void 0 : assets.map(a => {
    a.name = a.name.split('?')[0]; // These sizes are pretty large

    const isMainBundle = a.name.indexOf('umi.') === 0;
    const maxRecommendedSize = isMainBundle ? WARN_AFTER_BUNDLE_GZIP_SIZE : WARN_AFTER_CHUNK_GZIP_SIZE;
    const isLarge = maxRecommendedSize && a.size > maxRecommendedSize;
    return _objectSpread(_objectSpread({}, a), {}, {
      suggested: isLarge && isJS(a.name)
    });
  }).filter(a => {
    if (seenNames.has(a.name)) {
      return false;
    }

    seenNames.set(a.name, true);
    return isJS(a.name) || isCSS(a.name);
  }).sort((a, b) => {
    if (isJS(a.name) && isCSS(b.name)) return -1;
    if (isCSS(a.name) && isJS(b.name)) return 1;
    return b.size - a.size;
  });

  function getGzippedSize(asset) {
    const filepath = (0, _path().resolve)((0, _path().join)(dir, asset.name));

    if ((0, _fs().existsSync)(filepath)) {
      const buffer = (0, _fs().readFileSync)(filepath);
      return filesize(_zlib().default.gzipSync(buffer).length);
    }

    return filesize(0);
  }

  function makeRow(a, b, c) {
    return ` ${a}\t      ${b}\t ${c}`;
  }

  ui.div(makeRow(_utils().chalk.cyan.bold(`File`), _utils().chalk.cyan.bold(`Size`), _utils().chalk.cyan.bold(`Gzipped`)) + `\n\n` + (orderedAssets === null || orderedAssets === void 0 ? void 0 : orderedAssets.map(asset => makeRow(/js$/.test(asset.name) ? asset.suggested ? // warning for large bundle
  _utils().chalk.yellow((0, _path().join)(dir, asset.name)) : _utils().chalk.green((0, _path().join)(dir, asset.name)) : _utils().chalk.blue((0, _path().join)(dir, asset.name)), filesize(asset.size), getGzippedSize(asset))).join(`\n`)));
  console.log(`${ui.toString()}\n\n  ${_utils().chalk.gray(`Images and other types of assets omitted.`)}\n`);

  if (orderedAssets === null || orderedAssets === void 0 ? void 0 : orderedAssets.some(asset => asset.suggested)) {
    // We'll warn for bundles exceeding them.
    // TODO: use umi docs
    console.log();
    console.log(_utils().chalk.yellow('The bundle size is significantly larger than recommended.'));
    console.log(_utils().chalk.yellow('Consider reducing it with code splitting: https://umijs.org/docs/load-on-demand'));
    console.log(_utils().chalk.yellow('You can also analyze the project dependencies using ANALYZE=1'));
    console.log();
  }
}