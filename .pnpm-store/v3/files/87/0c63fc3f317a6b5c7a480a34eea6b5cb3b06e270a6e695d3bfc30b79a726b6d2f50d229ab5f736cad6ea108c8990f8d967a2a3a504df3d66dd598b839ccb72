"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileName = getFileName;
exports.init = init;
exports.files = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const files = ['webpack/lib/Chunk', 'webpack/lib/Compilation', 'webpack/lib/dependencies/ConstDependency', 'webpack/lib/javascript/JavascriptParserHelpers', 'webpack/lib/LibraryTemplatePlugin', 'webpack/lib/LoaderTargetPlugin', 'webpack/lib/node/NodeTargetPlugin', 'webpack/lib/node/NodeTemplatePlugin', 'webpack/lib/ModuleFilenameHelpers', 'webpack/lib/NormalModule', 'webpack/lib/RequestShortener', 'webpack/lib/RuntimeGlobals', 'webpack/lib/RuntimeModule', 'webpack/lib/optimize/LimitChunkCountPlugin', 'webpack/lib/ParserHelpers', 'webpack/lib/SingleEntryPlugin', 'webpack/lib/Template', 'webpack/lib/webworker/WebWorkerTemplatePlugin'];
exports.files = files;

function getFileName(filePath) {
  return filePath.split('/').slice(-1)[0];
}

let inited = false;

function init() {
  const skipRequireHookInit = process.env.INIT_REQUIRE_HOOK === 'none'; // Don't hook webpack when has skip flag
  // Allow run once

  if (skipRequireHookInit || inited) return;
  inited = true;
  const filesMap = files.map(file => {
    const fileName = getFileName(file);
    return [file, `@umijs/deps/compiled/webpack/${fileName}`];
  });
  const hookPropertyMap = new Map([['webpack', '@umijs/deps/compiled/webpack'], ['webpack/package.json', '@umijs/deps/compiled/webpack/pkgInfo'], ...filesMap // ['webpack-sources', '@umijs/deps/compiled/webpack/sources'],
  ].map(([request, replacement]) => [request, require.resolve(replacement)]));

  const mod = require('module');

  const resolveFilename = mod._resolveFilename;

  mod._resolveFilename = function (request, parent, isMain, options) {
    const hookResolved = hookPropertyMap.get(request);
    if (hookResolved) request = hookResolved;
    return resolveFilename.call(mod, request, parent, isMain, options);
  };
}