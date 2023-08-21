"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _core() {
  const data = require("@umijs/core");

  _core = function _core() {
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

var _buildDevUtils = require("../buildDevUtils");

var _generateFiles = _interopRequireDefault(require("../generateFiles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const logger = new (_core().Logger)('umi:preset-build-in');

function _default(api) {
  const paths = api.paths,
        rimraf = api.utils.rimraf;
  api.registerCommand({
    name: 'build',
    description: 'build application for production',
    fn: function () {
      var _fn = _asyncToGenerator(function* () {
        (0, _buildDevUtils.cleanTmpPathExceptCache)({
          absTmpPath: paths.absTmpPath
        }); // generate files

        yield (0, _generateFiles.default)({
          api,
          watch: false
        }); // build

        const _yield$getBundleAndCo = yield (0, _buildDevUtils.getBundleAndConfigs)({
          api
        }),
              bundler = _yield$getBundleAndCo.bundler,
              bundleConfigs = _yield$getBundleAndCo.bundleConfigs,
              bundleImplementor = _yield$getBundleAndCo.bundleImplementor;

        try {
          // clear output path before exec build
          if (process.env.CLEAR_OUTPUT !== 'none') {
            if (paths.absOutputPath && (0, _fs().existsSync)(paths.absOutputPath || '')) {
              logger.debug(`Clear OutputPath: ${paths.absNodeModulesPath}`);
              rimraf.sync(paths.absOutputPath);
            }
          }

          const _yield$bundler$build = yield bundler.build({
            bundleConfigs,
            bundleImplementor
          }),
                stats = _yield$bundler$build.stats;

          if (process.env.RM_TMPDIR !== 'none') {
            (0, _buildDevUtils.cleanTmpPathExceptCache)({
              absTmpPath: paths.absTmpPath
            });
          }

          (0, _buildDevUtils.printFileSizes)(stats, (0, _path().relative)(process.cwd(), paths.absOutputPath));
          yield api.applyPlugins({
            key: 'onBuildComplete',
            type: api.ApplyPluginsType.event,
            args: {
              stats
            }
          });
        } catch (err) {
          yield api.applyPlugins({
            key: 'onBuildComplete',
            type: api.ApplyPluginsType.event,
            args: {
              err
            }
          }); // throw build error

          throw err;
        }
      });

      function fn() {
        return _fn.apply(this, arguments);
      }

      return fn;
    }()
  });
}