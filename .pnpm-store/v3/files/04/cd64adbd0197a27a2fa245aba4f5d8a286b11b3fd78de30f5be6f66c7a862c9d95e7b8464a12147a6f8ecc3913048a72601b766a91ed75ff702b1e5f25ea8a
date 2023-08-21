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

function _webpack() {
  const data = _interopRequireWildcard(require("@umijs/deps/compiled/webpack"));

  _webpack = function _webpack() {
    return data;
  };

  return data;
}

var _CssModuleFactory = _interopRequireDefault(require("./CssModuleFactory"));

var _CssDependencyTemplate = _interopRequireDefault(require("./CssDependencyTemplate"));

var _CssDependency = _interopRequireDefault(require("./CssDependency"));

var _utils = require("./utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

// webpack 5 exposes the sources property to ensure the right version of webpack-sources is used
const _ref = // eslint-disable-next-line global-require
_webpack().default.sources || require('@umijs/deps/compiled/webpack-sources'),
      ConcatSource = _ref.ConcatSource,
      SourceMapSource = _ref.SourceMapSource,
      OriginalSource = _ref.OriginalSource;

const Template = _webpack().default.Template,
      createHash = _webpack().default.util.createHash;

const isWebpack4 = _webpack().version[0] === '4';
const pluginName = 'mini-css-extract-plugin';
const REGEXP_CHUNKHASH = /\[chunkhash(?::(\d+))?\]/i;
const REGEXP_CONTENTHASH = /\[contenthash(?::(\d+))?\]/i;
const REGEXP_NAME = /\[name\]/i;
const REGEXP_PLACEHOLDERS = /\[(name|id|chunkhash)\]/g;
const DEFAULT_FILENAME = '[name].css';

class MiniCssExtractPlugin {
  constructor(options = {}) {
    this.options = Object.assign({
      filename: DEFAULT_FILENAME,
      moduleFilename: () => this.options.filename || DEFAULT_FILENAME,
      ignoreOrder: false
    }, options);

    if (!this.options.chunkFilename) {
      const filename = this.options.filename; // Anything changing depending on chunk is fine

      if (filename.match(REGEXP_PLACEHOLDERS)) {
        this.options.chunkFilename = filename;
      } else {
        // Elsewise prefix '[id].' in front of the basename to make it changing
        this.options.chunkFilename = filename.replace(/(^|\/)([^/]*(?:\?|$))/, '$1[id].$2');
      }
    }

    if (!isWebpack4 && 'hmr' in this.options) {
      throw new Error("The 'hmr' option doesn't exist for the mini-css-extract-plugin when using webpack 5 (it's automatically determined)");
    }
  }
  /** @param {import("webpack").Compiler} compiler */


  apply(compiler) {
    if (!isWebpack4) {
      const splitChunks = compiler.options.optimization.splitChunks;

      if (splitChunks) {
        if (splitChunks.defaultSizeTypes.includes('...')) {
          splitChunks.defaultSizeTypes.push(_utils.MODULE_TYPE);
        }
      }
    }

    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      compilation.dependencyFactories.set(_CssDependency.default, new _CssModuleFactory.default());
      compilation.dependencyTemplates.set(_CssDependency.default, new _CssDependencyTemplate.default());

      if (isWebpack4) {
        compilation.mainTemplate.hooks.renderManifest.tap(pluginName, (result, {
          chunk
        }) => {
          const chunkGraph = compilation.chunkGraph;
          const renderedModules = Array.from(this.getChunkModules(chunk, chunkGraph)).filter(module => module.type === _utils.MODULE_TYPE);

          const filenameTemplate = chunk.filenameTemplate || (({
            chunk: chunkData
          }) => this.options.moduleFilename(chunkData));

          if (renderedModules.length > 0) {
            result.push({
              render: () => this.renderContentAsset(compilation, chunk, renderedModules, compilation.runtimeTemplate.requestShortener),
              filenameTemplate,
              pathOptions: {
                chunk,
                contentHashType: _utils.MODULE_TYPE
              },
              identifier: `${pluginName}.${chunk.id}`,
              hash: chunk.contentHash[_utils.MODULE_TYPE]
            });
          }
        });
        compilation.chunkTemplate.hooks.renderManifest.tap(pluginName, (result, {
          chunk
        }) => {
          const chunkGraph = compilation.chunkGraph;
          const renderedModules = Array.from(this.getChunkModules(chunk, chunkGraph)).filter(module => module.type === _utils.MODULE_TYPE);
          const filenameTemplate = chunk.filenameTemplate || this.options.chunkFilename;

          if (renderedModules.length > 0) {
            result.push({
              render: () => this.renderContentAsset(compilation, chunk, renderedModules, compilation.runtimeTemplate.requestShortener),
              filenameTemplate,
              pathOptions: {
                chunk,
                contentHashType: _utils.MODULE_TYPE
              },
              identifier: `${pluginName}.${chunk.id}`,
              hash: chunk.contentHash[_utils.MODULE_TYPE]
            });
          }
        });
      } else {
        compilation.hooks.renderManifest.tap(pluginName, (result, {
          chunk
        }) => {
          const chunkGraph = compilation.chunkGraph; // We don't need hot update chunks for css
          // We will use the real asset instead to update

          if (chunk instanceof _webpack().default.HotUpdateChunk) return;
          const renderedModules = Array.from(this.getChunkModules(chunk, chunkGraph)).filter(module => module.type === _utils.MODULE_TYPE);
          const filenameTemplate = chunk.canBeInitial() ? ({
            chunk: chunkData
          }) => this.options.moduleFilename(chunkData) : this.options.chunkFilename;

          if (renderedModules.length > 0) {
            result.push({
              render: () => this.renderContentAsset(compilation, chunk, renderedModules, compilation.runtimeTemplate.requestShortener),
              filenameTemplate,
              pathOptions: {
                chunk,
                contentHashType: _utils.MODULE_TYPE
              },
              identifier: `${pluginName}.${chunk.id}`,
              hash: chunk.contentHash[_utils.MODULE_TYPE]
            });
          }
        });
      }
      /*
       * For webpack 5 this will be unneeded once the logic uses a RuntimeModule
       * as the content of runtime modules is hashed and added to the chunk hash automatically
       * */


      if (isWebpack4) {
        compilation.mainTemplate.hooks.hashForChunk.tap(pluginName, (hash, chunk) => {
          const chunkFilename = this.options.chunkFilename;

          if (REGEXP_CHUNKHASH.test(chunkFilename)) {
            hash.update(JSON.stringify(chunk.getChunkMaps(true).hash));
          }

          if (REGEXP_CONTENTHASH.test(chunkFilename)) {
            hash.update(JSON.stringify(chunk.getChunkMaps(true).contentHash[_utils.MODULE_TYPE] || {}));
          }

          if (REGEXP_NAME.test(chunkFilename)) {
            hash.update(JSON.stringify(chunk.getChunkMaps(true).name));
          }
        });
      }

      compilation.hooks.contentHash.tap(pluginName, chunk => {
        const outputOptions = compilation.outputOptions,
              chunkGraph = compilation.chunkGraph;
        const hashFunction = outputOptions.hashFunction,
              hashDigest = outputOptions.hashDigest,
              hashDigestLength = outputOptions.hashDigestLength;
        const hash = createHash(hashFunction);

        var _iterator = _createForOfIteratorHelper(this.getChunkModules(chunk, chunkGraph)),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            const m = _step.value;

            if (m.type === _utils.MODULE_TYPE) {
              m.updateHash(hash, {
                chunkGraph
              });
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        const contentHash = chunk.contentHash;
        contentHash[_utils.MODULE_TYPE] = hash.digest(hashDigest).substring(0, hashDigestLength);
      });
      const mainTemplate = compilation.mainTemplate;

      if (isWebpack4) {
        mainTemplate.hooks.localVars.tap(pluginName, (source, chunk) => {
          const chunkMap = this.getCssChunkObject(chunk, compilation);

          if (Object.keys(chunkMap).length > 0) {
            return Template.asString([source, '', '// object to store loaded CSS chunks', 'var installedCssChunks = {', Template.indent(chunk.ids.map(id => `${JSON.stringify(id)}: 0`).join(',\n')), '};']);
          }

          return source;
        });
        mainTemplate.hooks.requireEnsure.tap(pluginName, (source, chunk, hash) => {
          const chunkMap = this.getCssChunkObject(chunk, compilation);

          if (Object.keys(chunkMap).length > 0) {
            const chunkMaps = chunk.getChunkMaps();
            const crossOriginLoading = mainTemplate.outputOptions.crossOriginLoading;
            const linkHrefPath = mainTemplate.getAssetPath(JSON.stringify(this.options.chunkFilename), {
              hash: `" + ${mainTemplate.renderCurrentHashCode(hash)} + "`,
              hashWithLength: length => `" + ${mainTemplate.renderCurrentHashCode(hash, length)} + "`,
              chunk: {
                id: '" + chunkId + "',
                hash: `" + ${JSON.stringify(chunkMaps.hash)}[chunkId] + "`,

                hashWithLength(length) {
                  const shortChunkHashMap = Object.create(null);

                  for (var _i = 0, _Object$keys = Object.keys(chunkMaps.hash); _i < _Object$keys.length; _i++) {
                    const chunkId = _Object$keys[_i];

                    if (typeof chunkMaps.hash[chunkId] === 'string') {
                      shortChunkHashMap[chunkId] = chunkMaps.hash[chunkId].substring(0, length);
                    }
                  }

                  return `" + ${JSON.stringify(shortChunkHashMap)}[chunkId] + "`;
                },

                contentHash: {
                  [_utils.MODULE_TYPE]: `" + ${JSON.stringify(chunkMaps.contentHash[_utils.MODULE_TYPE])}[chunkId] + "`
                },
                contentHashWithLength: {
                  [_utils.MODULE_TYPE]: length => {
                    const shortContentHashMap = {};
                    const contentHash = chunkMaps.contentHash[_utils.MODULE_TYPE];

                    for (var _i2 = 0, _Object$keys2 = Object.keys(contentHash); _i2 < _Object$keys2.length; _i2++) {
                      const chunkId = _Object$keys2[_i2];

                      if (typeof contentHash[chunkId] === 'string') {
                        shortContentHashMap[chunkId] = contentHash[chunkId].substring(0, length);
                      }
                    }

                    return `" + ${JSON.stringify(shortContentHashMap)}[chunkId] + "`;
                  }
                },
                name: `" + (${JSON.stringify(chunkMaps.name)}[chunkId]||chunkId) + "`
              },
              contentHashType: _utils.MODULE_TYPE
            });
            return Template.asString([source, '', `// ${pluginName} CSS loading`, `var cssChunks = ${JSON.stringify(chunkMap)};`, 'if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);', 'else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {', Template.indent(['promises.push(installedCssChunks[chunkId] = new Promise(function(resolve, reject) {', Template.indent([`var href = ${linkHrefPath};`, `var fullhref = ${mainTemplate.requireFn}.p + href;`, 'var existingLinkTags = document.getElementsByTagName("link");', 'for(var i = 0; i < existingLinkTags.length; i++) {', Template.indent(['var tag = existingLinkTags[i];', 'var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");', 'if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return resolve();']), '}', 'var existingStyleTags = document.getElementsByTagName("style");', 'for(var i = 0; i < existingStyleTags.length; i++) {', Template.indent(['var tag = existingStyleTags[i];', 'var dataHref = tag.getAttribute("data-href");', 'if(dataHref === href || dataHref === fullhref) return resolve();']), '}', 'var linkTag = document.createElement("link");', 'linkTag.rel = "stylesheet";', 'linkTag.type = "text/css";', 'linkTag.onload = resolve;', 'linkTag.onerror = function(event) {', Template.indent(['var request = event && event.target && event.target.src || fullhref;', 'var err = new Error("Loading CSS chunk " + chunkId + " failed.\\n(" + request + ")");', 'err.code = "CSS_CHUNK_LOAD_FAILED";', 'err.request = request;', 'delete installedCssChunks[chunkId]', 'linkTag.parentNode.removeChild(linkTag)', 'reject(err);']), '};', 'linkTag.href = fullhref;', crossOriginLoading ? Template.asString([`if (linkTag.href.indexOf(window.location.origin + '/') !== 0) {`, Template.indent(`linkTag.crossOrigin = ${JSON.stringify(crossOriginLoading)};`), '}']) : '', 'var head = document.getElementsByTagName("head")[0];', 'head.appendChild(linkTag);']), '}).then(function() {', Template.indent(['installedCssChunks[chunkId] = 0;']), '}));']), '}']);
          }

          return source;
        });
      } else {
        const enabledChunks = new WeakSet();

        const handler = (chunk, set) => {
          if (enabledChunks.has(chunk)) return;
          enabledChunks.add(chunk); // eslint-disable-next-line global-require

          const CssLoadingRuntimeModule = require('./CssLoadingRuntimeModule');

          set.add(_webpack().default.RuntimeGlobals.publicPath);
          compilation.addRuntimeModule(chunk, new (_webpack().default.runtime.GetChunkFilenameRuntimeModule)(_utils.MODULE_TYPE, 'mini-css', `${_webpack().default.RuntimeGlobals.require}.miniCssF`, referencedChunk => referencedChunk.canBeInitial() ? ({
            chunk: chunkData
          }) => this.options.moduleFilename(chunkData) : this.options.chunkFilename, true));
          compilation.addRuntimeModule(chunk, new CssLoadingRuntimeModule(set));
        };

        compilation.hooks.runtimeRequirementInTree.for(_webpack().default.RuntimeGlobals.ensureChunkHandlers).tap(pluginName, handler);
        compilation.hooks.runtimeRequirementInTree.for(_webpack().default.RuntimeGlobals.hmrDownloadUpdateHandlers).tap(pluginName, handler);
      }
    });
  }

  getChunkModules(chunk, chunkGraph) {
    return typeof chunkGraph !== 'undefined' ? chunkGraph.getOrderedChunkModulesIterable(chunk, _utils.compareModulesByIdentifier) : chunk.modulesIterable;
  }

  getCssChunkObject(mainChunk, compilation) {
    const obj = {};
    const chunkGraph = compilation.chunkGraph;

    var _iterator2 = _createForOfIteratorHelper(mainChunk.getAllAsyncChunks()),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        const chunk = _step2.value;

        var _iterator3 = _createForOfIteratorHelper(this.getChunkModules(chunk, chunkGraph)),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            const module = _step3.value;

            if (module.type === _utils.MODULE_TYPE) {
              obj[chunk.id] = 1;
              break;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return obj;
  }

  renderContentAsset(compilation, chunk, modules, requestShortener) {
    let usedModules;

    const _chunk$groupsIterable = _slicedToArray(chunk.groupsIterable, 1),
          chunkGroup = _chunk$groupsIterable[0];

    const moduleIndexFunctionName = typeof compilation.chunkGraph !== 'undefined' ? 'getModulePostOrderIndex' : 'getModuleIndex2';

    if (typeof chunkGroup[moduleIndexFunctionName] === 'function') {
      // Store dependencies for modules
      const moduleDependencies = new Map(modules.map(m => [m, new Set()]));
      const moduleDependenciesReasons = new Map(modules.map(m => [m, new Map()])); // Get ordered list of modules per chunk group
      // This loop also gathers dependencies from the ordered lists
      // Lists are in reverse order to allow to use Array.pop()

      const modulesByChunkGroup = Array.from(chunk.groupsIterable, cg => {
        const sortedModules = modules.map(m => {
          return {
            module: m,
            index: cg[moduleIndexFunctionName](m)
          };
        }) // eslint-disable-next-line no-undefined
        .filter(item => item.index !== undefined).sort((a, b) => b.index - a.index).map(item => item.module);

        for (let i = 0; i < sortedModules.length; i++) {
          const set = moduleDependencies.get(sortedModules[i]);
          const reasons = moduleDependenciesReasons.get(sortedModules[i]);

          for (let j = i + 1; j < sortedModules.length; j++) {
            const module = sortedModules[j];
            set.add(module);
            const reason = reasons.get(module) || new Set();
            reason.add(cg);
            reasons.set(module, reason);
          }
        }

        return sortedModules;
      }); // set with already included modules in correct order

      usedModules = new Set();

      const unusedModulesFilter = m => !usedModules.has(m);

      while (usedModules.size < modules.length) {
        let success = false;
        let bestMatch;
        let bestMatchDeps; // get first module where dependencies are fulfilled

        var _iterator4 = _createForOfIteratorHelper(modulesByChunkGroup),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            const list = _step4.value;

            // skip and remove already added modules
            while (list.length > 0 && usedModules.has(list[list.length - 1])) {
              list.pop();
            } // skip empty lists


            if (list.length !== 0) {
              const module = list[list.length - 1];
              const deps = moduleDependencies.get(module); // determine dependencies that are not yet included

              const failedDeps = Array.from(deps).filter(unusedModulesFilter); // store best match for fallback behavior

              if (!bestMatchDeps || bestMatchDeps.length > failedDeps.length) {
                bestMatch = list;
                bestMatchDeps = failedDeps;
              }

              if (failedDeps.length === 0) {
                // use this module and remove it from list
                usedModules.add(list.pop());
                success = true;
                break;
              }
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        if (!success) {
          // no module found => there is a conflict
          // use list with fewest failed deps
          // and emit a warning
          const fallbackModule = bestMatch.pop();

          if (!this.options.ignoreOrder) {
            const reasons = moduleDependenciesReasons.get(fallbackModule);
            compilation.warnings.push(new Error([`chunk ${chunk.name || chunk.id} [${pluginName}]`, 'Conflicting order. Following module has been added:', ` * ${fallbackModule.readableIdentifier(requestShortener)}`, 'despite it was not able to fulfill desired ordering with these modules:', ...bestMatchDeps.map(m => {
              const goodReasonsMap = moduleDependenciesReasons.get(m);
              const goodReasons = goodReasonsMap && goodReasonsMap.get(fallbackModule);
              const failedChunkGroups = Array.from(reasons.get(m), cg => cg.name).join(', ');
              const goodChunkGroups = goodReasons && Array.from(goodReasons, cg => cg.name).join(', ');
              return [` * ${m.readableIdentifier(requestShortener)}`, `   - couldn't fulfill desired order of chunk group(s) ${failedChunkGroups}`, goodChunkGroups && `   - while fulfilling desired order of chunk group(s) ${goodChunkGroups}`].filter(Boolean).join('\n');
            })].join('\n')));
          }

          usedModules.add(fallbackModule);
        }
      }
    } else {
      // fallback for older webpack versions
      // (to avoid a breaking change)
      // TODO remove this in next major version
      // and increase minimum webpack version to 4.12.0
      modules.sort((a, b) => a.index2 - b.index2);
      usedModules = modules;
    }

    const source = new ConcatSource();
    const externalsSource = new ConcatSource();

    var _iterator5 = _createForOfIteratorHelper(usedModules),
        _step5;

    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        const m = _step5.value;

        if (/^@import url/.test(m.content)) {
          // HACK for IE
          // http://stackoverflow.com/a/14676665/1458162
          let content = m.content;

          if (m.media) {
            // insert media into the @import
            // this is rar
            // TODO improve this and parse the CSS to support multiple medias
            content = content.replace(/;|\s*$/, m.media);
          }

          externalsSource.add(content);
          externalsSource.add('\n');
        } else {
          if (m.media) {
            source.add(`@media ${m.media} {\n`);
          }

          if (m.sourceMap) {
            source.add(new SourceMapSource(m.content, m.readableIdentifier(requestShortener), m.sourceMap));
          } else {
            source.add(new OriginalSource(m.content, m.readableIdentifier(requestShortener)));
          }

          source.add('\n');

          if (m.media) {
            source.add('}\n');
          }
        }
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }

    return new ConcatSource(externalsSource, source);
  }

}

MiniCssExtractPlugin.loader = require.resolve('./loader');
var _default = MiniCssExtractPlugin;
exports.default = _default;