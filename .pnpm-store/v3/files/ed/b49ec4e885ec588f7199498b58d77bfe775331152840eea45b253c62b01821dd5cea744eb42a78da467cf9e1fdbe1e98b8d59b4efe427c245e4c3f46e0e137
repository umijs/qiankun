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

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(api) {
  const paths = api.paths,
        Mustache = api.utils.Mustache;
  api.onGenerateFiles( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (args) {
      var _getFile;

      const validKeys = yield api.applyPlugins({
        key: 'addRuntimePluginKey',
        type: api.ApplyPluginsType.add,
        initialValue: ['modifyClientRenderOpts', 'patchRoutes', 'rootContainer', 'render', 'onRouteChange', '__mfsu']
      });
      const appRuntimeFilePath = process.env.RUNTIME_APP_JS !== 'none' ? (_getFile = (0, _utils().getFile)({
        base: paths.absSrcPath,
        fileNameWithoutExt: 'app',
        type: 'javascript'
      })) === null || _getFile === void 0 ? void 0 : _getFile.path : undefined;
      const plugins = yield api.applyPlugins({
        key: 'addRuntimePlugin',
        type: api.ApplyPluginsType.add,
        initialValue: appRuntimeFilePath ? [api.utils.winPath((0, _path().relative)((0, _path().join)(api.paths.absTmpPath, 'core'), appRuntimeFilePath))] : []
      });
      api.writeTmpFile({
        path: 'core/plugin.ts',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'plugin.tpl'), 'utf-8'), {
          validKeys,
          runtimePath: _constants.runtimePath
        })
      });
      api.writeTmpFile({
        path: 'core/pluginRegister.ts',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'pluginRegister.tpl'), 'utf-8'), {
          plugins: plugins.map((plugin, index) => {
            return {
              index,
              path: (0, _utils().winPath)(plugin)
            };
          })
        })
      });
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  api.addUmiExports(() => {
    return {
      specifiers: ['plugin'],
      source: `./plugin`
    };
  });
}