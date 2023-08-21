"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pitch = pitch;
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _loaderUtils() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/loader-utils"));

  _loaderUtils = function _loaderUtils() {
    return data;
  };

  return data;
}

function _webpack() {
  const data = require("@umijs/deps/compiled/webpack");

  _webpack = function _webpack() {
    return data;
  };

  return data;
}

function _LibraryTemplatePlugin() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/webpack/LibraryTemplatePlugin"));

  _LibraryTemplatePlugin = function _LibraryTemplatePlugin() {
    return data;
  };

  return data;
}

function _LimitChunkCountPlugin() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/webpack/LimitChunkCountPlugin"));

  _LimitChunkCountPlugin = function _LimitChunkCountPlugin() {
    return data;
  };

  return data;
}

function _NodeTargetPlugin() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/webpack/NodeTargetPlugin"));

  _NodeTargetPlugin = function _NodeTargetPlugin() {
    return data;
  };

  return data;
}

function _NodeTemplatePlugin() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/webpack/NodeTemplatePlugin"));

  _NodeTemplatePlugin = function _NodeTemplatePlugin() {
    return data;
  };

  return data;
}

function _NormalModule() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/webpack/NormalModule"));

  _NormalModule = function _NormalModule() {
    return data;
  };

  return data;
}

function _SingleEntryPlugin() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/webpack/SingleEntryPlugin"));

  _SingleEntryPlugin = function _SingleEntryPlugin() {
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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

var _CssDependency = _interopRequireDefault(require("./CssDependency"));

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const pluginName = 'mini-css-extract-plugin';
const isWebpack4 = _webpack().version[0] === '4';

function hotLoader(content, context) {
  const accept = context.locals ? '' : 'module.hot.accept(undefined, cssReload);';
  return `${content}
    if(module.hot) {
      // ${Date.now()}
      var cssReload = require(${_loaderUtils().default.stringifyRequest(context.context, (0, _utils().winPath)(_path().default.join(__dirname, '../../../../../bundled/css/hotModuleReplacement.js')))})(module.id, ${JSON.stringify(_objectSpread(_objectSpread({}, context.options), {}, {
    locals: !!context.locals
  }))});
      module.hot.dispose(cssReload);
      ${accept}
    }
  `;
}

function pitch(request) {
  const options = _loaderUtils().default.getOptions(this) || {};
  const loaders = this.loaders.slice(this.loaderIndex + 1);
  this.addDependency(this.resourcePath);
  const childFilename = '*';
  const publicPath = typeof options.publicPath === 'string' ? options.publicPath === '' || options.publicPath.endsWith('/') ? options.publicPath : `${options.publicPath}/` : typeof options.publicPath === 'function' ? options.publicPath(this.resourcePath, this.rootContext) : this._compilation.outputOptions.publicPath;
  const outputOptions = {
    filename: childFilename,
    publicPath
  };

  const childCompiler = this._compilation.createChildCompiler(`${pluginName} ${request}`, outputOptions);

  new (_NodeTemplatePlugin().default)(outputOptions).apply(childCompiler);
  new (_LibraryTemplatePlugin().default)(null, 'commonjs2').apply(childCompiler);
  new (_NodeTargetPlugin().default)().apply(childCompiler);
  new (_SingleEntryPlugin().default)(this.context, `!!${request}`, pluginName).apply(childCompiler);
  new (_LimitChunkCountPlugin().default)({
    maxChunks: 1
  }).apply(childCompiler);
  childCompiler.hooks.thisCompilation.tap(`${pluginName} loader`, compilation => {
    const normalModuleHook = typeof _NormalModule().default.getCompilationHooks !== 'undefined' ? _NormalModule().default.getCompilationHooks(compilation).loader : compilation.hooks.normalModuleLoader;
    normalModuleHook.tap(`${pluginName} loader`, (loaderContext, module) => {
      // eslint-disable-next-line no-param-reassign
      loaderContext.emitFile = this.emitFile;

      if (module.request === request) {
        // eslint-disable-next-line no-param-reassign
        module.loaders = loaders.map(loader => {
          return {
            loader: loader.path,
            options: loader.options,
            ident: loader.ident
          };
        });
      }
    });
  });
  let source;

  if (isWebpack4) {
    childCompiler.hooks.afterCompile.tap(pluginName, compilation => {
      source = compilation.assets[childFilename] && compilation.assets[childFilename].source(); // Remove all chunk assets

      compilation.chunks.forEach(chunk => {
        chunk.files.forEach(file => {
          delete compilation.assets[file]; // eslint-disable-line no-param-reassign
        });
      });
    });
  } else {
    childCompiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.processAssets.tap(pluginName, () => {
        source = compilation.assets[childFilename] && compilation.assets[childFilename].source(); // Remove all chunk assets

        compilation.chunks.forEach(chunk => {
          chunk.files.forEach(file => {
            compilation.deleteAsset(file);
          });
        });
      });
    });
  }

  const callback = this.async();
  childCompiler.runAsChild((err, entries, compilation) => {
    const addDependencies = dependencies => {
      if (!Array.isArray(dependencies) && dependencies != null) {
        throw new Error(`Exported value was not extracted as an array: ${JSON.stringify(dependencies)}`);
      }

      const identifierCountMap = new Map();

      var _iterator = _createForOfIteratorHelper(dependencies),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          const dependency = _step.value;
          const count = identifierCountMap.get(dependency.identifier) || 0;

          this._module.addDependency(new _CssDependency.default(dependency, dependency.context, count));

          identifierCountMap.set(dependency.identifier, count + 1);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };

    if (err) {
      return callback(err);
    }

    if (compilation.errors.length > 0) {
      return callback(compilation.errors[0]);
    }

    compilation.fileDependencies.forEach(dep => {
      this.addDependency(dep);
    }, this);
    compilation.contextDependencies.forEach(dep => {
      this.addContextDependency(dep);
    }, this);

    if (!source) {
      return callback(new Error("Didn't get a result from child compiler"));
    }

    let locals;
    const esModule = typeof options.esModule !== 'undefined' ? options.esModule : false;
    const namedExport = esModule && options.modules && options.modules.namedExport;

    try {
      const originalExports = (0, _utils2.evalModuleCode)(this, source, request); // eslint-disable-next-line no-underscore-dangle

      exports = originalExports.__esModule ? originalExports.default : originalExports;

      if (namedExport) {
        Object.keys(originalExports).forEach(key => {
          if (key !== 'default') {
            if (!locals) locals = {};
            locals[key] = originalExports[key];
          }
        });
      } else {
        locals = exports && exports.locals;
      }

      let dependencies;

      if (!Array.isArray(exports)) {
        dependencies = [[null, exports]];
      } else {
        dependencies = exports.map(([id, content, media, sourceMap]) => {
          const module = (0, _utils2.findModuleById)(compilation, id);
          return {
            identifier: module.identifier(),
            context: module.context,
            content,
            media,
            sourceMap
          };
        });
      }

      addDependencies(dependencies);
    } catch (e) {
      return callback(e);
    }

    const result = locals ? namedExport ? Object.keys(locals).map(key => `\nexport const ${key} = ${JSON.stringify(locals[key])};`).join('') : `\n${esModule ? 'export default' : 'module.exports ='} ${JSON.stringify(locals)};` : esModule ? `\nexport {};` : '';
    let resultSource = `// extracted by ${pluginName}`;
    resultSource += options.hmr ? hotLoader(result, {
      context: this.context,
      options,
      locals
    }) : result;
    return callback(null, resultSource);
  });
} // eslint-disable-next-line func-names


function _default() {}