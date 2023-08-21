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

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

var _DevCompileDonePlugin = _interopRequireDefault(require("./DevCompileDonePlugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const args = (0, _utils().yParser)(process.argv.slice(2));

var _default = api => {
  api.modifyBundleConfig((bundleConfig, {
    env,
    bundler: {
      id
    },
    mfsu,
    type
  }) => {
    if (!mfsu && env === 'development' && id === 'webpack') {
      var _bundleConfig$plugins, _api$config, _api$config2, _api$config2$devServe;

      (_bundleConfig$plugins = bundleConfig.plugins) === null || _bundleConfig$plugins === void 0 ? void 0 : _bundleConfig$plugins.push(new _DevCompileDonePlugin.default({
        port: api.getPort(),
        hostname: api.getHostname(),
        https: !!(((_api$config = api.config) === null || _api$config === void 0 ? void 0 : _api$config.devServer) && ((_api$config2 = api.config) === null || _api$config2 === void 0 ? void 0 : (_api$config2$devServe = _api$config2.devServer) === null || _api$config2$devServe === void 0 ? void 0 : _api$config2$devServe.https) || process.env.HTTPS || (args === null || args === void 0 ? void 0 : args.https)),

        onCompileDone({
          isFirstCompile,
          stats
        }) {
          if (isFirstCompile) {
            api.service.emit('firstDevCompileDone');
          }

          api.applyPlugins({
            key: 'onDevCompileDone',
            type: api.ApplyPluginsType.event,
            args: {
              isFirstCompile,
              type,
              stats
            }
          }).catch(e => {
            console.error(_utils().chalk.red(e.stack));
          });
        },

        onCompileFail({
          stats
        }) {
          if (stats.hasErrors()) {
            console.error(stats.toString('errors-only'));
          }

          _utils().printHelp.feedback();
        }

      }));
    }

    return bundleConfig;
  });
};

exports.default = _default;