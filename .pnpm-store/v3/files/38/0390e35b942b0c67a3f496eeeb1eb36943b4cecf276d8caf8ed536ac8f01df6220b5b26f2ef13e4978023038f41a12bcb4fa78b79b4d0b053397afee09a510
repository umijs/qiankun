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

function _os() {
  const data = require("os");

  _os = function _os() {
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

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(api) {
  ['onGenerateFiles', 'onBuildComplete', 'onExit', 'onPatchRoute', 'onPatchRouteBefore', 'onPatchRoutes', 'onPatchRoutesBefore', 'onDevCompileDone', 'addBeforeMiddlewares', 'addBeforeMiddewares', 'addDepInfo', 'addDevScripts', 'addMiddlewares', 'addMiddewares', 'addRuntimePlugin', 'addRuntimePluginKey', 'addUmiExports', 'addProjectFirstLibraries', 'addPolyfillImports', 'addEntryImportsAhead', 'addEntryImports', 'addEntryCodeAhead', 'addEntryCode', 'addHTMLMetas', 'addHTMLLinks', 'addHTMLStyles', 'addHTMLHeadScripts', 'addHTMLScripts', 'addTmpGenerateWatcherPaths', 'chainWebpack', 'modifyHTML', 'modifyBundler', 'modifyBundleConfigOpts', 'modifyBundleConfig', 'modifyBundleConfigs', 'modifyBabelOpts', 'modifyBabelPresetOpts', 'modifyBundleImplementor', 'modifyHTMLChunks', 'modifyDevHTMLContent', 'modifyExportRouteMap', 'modifyProdHTMLContent', 'modifyPublicPathStr', 'modifyRendererPath', 'modifyRoutes'].forEach(name => {
    api.registerMethod({
      name
    });
  });
  api.registerMethod({
    name: 'writeTmpFile',

    fn({
      path,
      content,
      skipTSCheck = true
    }) {
      (0, _assert().default)(api.stage >= api.ServiceStage.pluginReady, `api.writeTmpFile() should not execute in register stage.`);
      const absPath = (0, _path().join)(api.paths.absTmpPath, path);
      api.utils.mkdirp.sync((0, _path().dirname)(absPath));

      if ((0, _utils.isTSFile)(path) && skipTSCheck) {
        // write @ts-nocheck into first line
        content = `// @ts-nocheck${_os().EOL}${content}`;
      }

      if (!(0, _fs().existsSync)(absPath) || (0, _fs().readFileSync)(absPath, 'utf-8') !== content) {
        (0, _fs().writeFileSync)(absPath, content, 'utf-8');
      }
    }

  });
}