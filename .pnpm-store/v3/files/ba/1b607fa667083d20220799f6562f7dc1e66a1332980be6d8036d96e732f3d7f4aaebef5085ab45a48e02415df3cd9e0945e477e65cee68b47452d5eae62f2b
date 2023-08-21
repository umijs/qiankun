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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
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

function _sourceMap() {
  const data = require("@umijs/deps/compiled/source-map");

  _sourceMap = function _sourceMap() {
    return data;
  };

  return data;
}

function _webpack() {
  const data = _interopRequireWildcard(require("webpack"));

  _webpack = function _webpack() {
    return data;
  };

  return data;
}

function _RequestShortener() {
  const data = _interopRequireDefault(require("webpack/lib/RequestShortener"));

  _RequestShortener = function _RequestShortener() {
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

var _package = _interopRequireDefault(require("terser/package.json"));

function _pLimit() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/p-limit"));

  _pLimit = function _pLimit() {
    return data;
  };

  return data;
}

function _jestWorker() {
  const data = _interopRequireDefault(require("jest-worker"));

  _jestWorker = function _jestWorker() {
    return data;
  };

  return data;
}

var _minify = require("./minify");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// webpack 5 exposes the sources property to ensure the right version of webpack-sources is used
const _ref = // eslint-disable-next-line global-require
_webpack().default.sources || require('@umijs/deps/compiled/webpack-sources'),
      SourceMapSource = _ref.SourceMapSource,
      RawSource = _ref.RawSource,
      ConcatSource = _ref.ConcatSource;

class TerserPlugin {
  constructor(options = {}) {
    const minify = options.minify,
          _options$terserOption = options.terserOptions,
          terserOptions = _options$terserOption === void 0 ? {} : _options$terserOption,
          _options$test = options.test,
          test = _options$test === void 0 ? /\.[cm]?js(\?.*)?$/i : _options$test,
          _options$extractComme = options.extractComments,
          extractComments = _options$extractComme === void 0 ? true : _options$extractComme,
          sourceMap = options.sourceMap,
          _options$cache = options.cache,
          cache = _options$cache === void 0 ? true : _options$cache,
          _options$cacheKeys = options.cacheKeys,
          cacheKeys = _options$cacheKeys === void 0 ? defaultCacheKeys => defaultCacheKeys : _options$cacheKeys,
          _options$parallel = options.parallel,
          parallel = _options$parallel === void 0 ? true : _options$parallel,
          include = options.include,
          exclude = options.exclude;
    this.options = {
      test,
      extractComments,
      sourceMap,
      cache,
      cacheKeys,
      parallel,
      include,
      exclude,
      minify,
      terserOptions
    };
  }

  static isSourceMap(input) {
    // All required options for `new SourceMapConsumer(...options)`
    // https://github.com/mozilla/source-map#new-sourcemapconsumerrawsourcemap
    return Boolean(input && input.version && input.sources && Array.isArray(input.sources) && typeof input.mappings === 'string');
  }

  static buildError(error, file, sourceMap, requestShortener) {
    if (error.line) {
      const original = sourceMap && sourceMap.originalPositionFor({
        line: error.line,
        column: error.col
      });

      if (original && original.source && requestShortener) {
        return new Error(`${file} from Terser\n${error.message} [${requestShortener.shorten(original.source)}:${original.line},${original.column}][${file}:${error.line},${error.col}]${error.stack ? `\n${error.stack.split('\n').slice(1).join('\n')}` : ''}`);
      }

      return new Error(`${file} from Terser\n${error.message} [${file}:${error.line},${error.col}]${error.stack ? `\n${error.stack.split('\n').slice(1).join('\n')}` : ''}`);
    }

    if (error.stack) {
      return new Error(`${file} from Terser\n${error.stack}`);
    }

    return new Error(`${file} from Terser\n${error.message}`);
  }

  static isWebpack4() {
    return _webpack().version[0] === '4';
  }

  static getAvailableNumberOfCores(parallel) {
    // In some cases cpus() returns undefined
    // https://github.com/nodejs/node/issues/19022
    const cpus = _os().default.cpus() || {
      length: 1
    };
    return parallel === true ? cpus.length - 1 : Math.min(Number(parallel) || 0, cpus.length - 1);
  } // eslint-disable-next-line consistent-return


  static getAsset(compilation, name) {
    // New API
    if (compilation.getAsset) {
      return compilation.getAsset(name);
    }
    /* istanbul ignore next */


    if (compilation.assets[name]) {
      return {
        name,
        source: compilation.assets[name],
        info: {}
      };
    }
  }

  static emitAsset(compilation, name, source, assetInfo) {
    // New API
    if (compilation.emitAsset) {
      compilation.emitAsset(name, source, assetInfo);
    } // eslint-disable-next-line no-param-reassign


    compilation.assets[name] = source;
  }

  static updateAsset(compilation, name, newSource, assetInfo) {
    // New API
    if (compilation.updateAsset) {
      compilation.updateAsset(name, newSource, assetInfo);
    } // eslint-disable-next-line no-param-reassign


    compilation.assets[name] = newSource;
  }

  optimize(compiler, compilation, assets, CacheEngine, weakCache) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let assetNames;

      if (TerserPlugin.isWebpack4()) {
        assetNames = [].concat(Array.from(compilation.additionalChunkAssets || [])).concat( // In webpack@4 it is `chunks`
        Array.from(assets).reduce((acc, chunk) => acc.concat(Array.from(chunk.files || [])), [])).concat(Object.keys(compilation.assets)).filter((assetName, index, existingAssets) => existingAssets.indexOf(assetName) === index).filter(assetName => _webpack().ModuleFilenameHelpers.matchObject.bind( // eslint-disable-next-line no-undefined
        undefined, _this.options)(assetName));
      } else {
        assetNames = Object.keys(assets).filter(assetName => _webpack().ModuleFilenameHelpers.matchObject.bind( // eslint-disable-next-line no-undefined
        undefined, _this.options)(assetName));
      }

      if (assetNames.length === 0) {
        return;
      }

      const availableNumberOfCores = TerserPlugin.getAvailableNumberOfCores(_this.options.parallel);
      let concurrency = Infinity;
      let worker;

      if (availableNumberOfCores > 0) {
        // Do not create unnecessary workers when the number of files is less than the available cores, it saves memory
        const numWorkers = Math.min(assetNames.length, availableNumberOfCores);
        concurrency = numWorkers;
        worker = new (_jestWorker().default)(require.resolve('./minify'), {
          numWorkers
        }); // https://github.com/facebook/jest/issues/8872#issuecomment-524822081

        const workerStdout = worker.getStdout();

        if (workerStdout) {
          workerStdout.on('data', chunk => {
            return process.stdout.write(chunk);
          });
        }

        const workerStderr = worker.getStderr();

        if (workerStderr) {
          workerStderr.on('data', chunk => {
            return process.stderr.write(chunk);
          });
        }
      }

      const limit = (0, _pLimit().default)(concurrency);
      const cache = new CacheEngine(compilation, {
        cache: _this.options.cache
      }, weakCache);
      const allExtractedComments = new Map();
      const scheduledTasks = [];

      var _iterator = _createForOfIteratorHelper(assetNames),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          const name = _step.value;
          scheduledTasks.push(limit( /*#__PURE__*/_asyncToGenerator(function* () {
            const _TerserPlugin$getAsse = TerserPlugin.getAsset(compilation, name),
                  info = _TerserPlugin$getAsse.info,
                  inputSource = _TerserPlugin$getAsse.source; // Skip double minimize assets from child compilation


            if (info.minimized) {
              return;
            }

            let input;
            let inputSourceMap; // TODO refactor after drop webpack@4, webpack@5 always has `sourceAndMap` on sources

            if (_this.options.sourceMap && inputSource.sourceAndMap) {
              const _inputSource$sourceAn = inputSource.sourceAndMap(),
                    source = _inputSource$sourceAn.source,
                    map = _inputSource$sourceAn.map;

              input = source;

              if (map) {
                if (TerserPlugin.isSourceMap(map)) {
                  inputSourceMap = map;
                } else {
                  inputSourceMap = map;
                  compilation.warnings.push(new Error(`${name} contains invalid source map`));
                }
              }
            } else {
              input = inputSource.source();
              inputSourceMap = null;
            }

            if (Buffer.isBuffer(input)) {
              input = input.toString();
            }

            const cacheData = {
              name,
              inputSource
            };

            if (TerserPlugin.isWebpack4()) {
              if (_this.options.cache) {
                const _compilation$outputOp2 = compilation.outputOptions,
                      hashSalt = _compilation$outputOp2.hashSalt,
                      hashDigest = _compilation$outputOp2.hashDigest,
                      hashDigestLength = _compilation$outputOp2.hashDigestLength,
                      hashFunction = _compilation$outputOp2.hashFunction;

                const hash = _webpack().util.createHash(hashFunction);

                if (hashSalt) {
                  hash.update(hashSalt);
                }

                hash.update(input);
                const digest = hash.digest(hashDigest);
                cacheData.input = input;
                cacheData.inputSourceMap = inputSourceMap;
                cacheData.cacheKeys = _this.options.cacheKeys({
                  terser: _package.default.version,
                  // eslint-disable-next-line global-require
                  'terser-webpack-plugin': require('../package.json').version,
                  'terser-webpack-plugin-options': _this.options,
                  name,
                  contentHash: digest.substr(0, hashDigestLength)
                }, name);
              }
            }

            let output = yield cache.get(cacheData, {
              RawSource,
              ConcatSource,
              SourceMapSource
            });

            if (!output) {
              const minimizerOptions = {
                name,
                input,
                inputSourceMap,
                minify: _this.options.minify,
                minimizerOptions: _this.options.terserOptions,
                extractComments: _this.options.extractComments
              };

              if (/\.mjs(\?.*)?$/i.test(name)) {
                _this.options.terserOptions.module = true;
              }

              try {
                output = yield worker ? worker.transform((0, _serializeJavascript().default)(minimizerOptions)) : (0, _minify.minify)(minimizerOptions);
              } catch (error) {
                compilation.errors.push(TerserPlugin.buildError(error, name, inputSourceMap && TerserPlugin.isSourceMap(inputSourceMap) ? new (_sourceMap().SourceMapConsumer)(inputSourceMap) : null, new (_RequestShortener().default)(compiler.context)));
                return;
              }

              let shebang;

              if (_this.options.extractComments.banner !== false && output.extractedComments && output.extractedComments.length > 0 && output.code.startsWith('#!')) {
                const firstNewlinePosition = output.code.indexOf('\n');
                shebang = output.code.substring(0, firstNewlinePosition);
                output.code = output.code.substring(firstNewlinePosition + 1);
              }

              if (output.map) {
                output.source = new SourceMapSource(output.code, name, output.map, input, inputSourceMap, true);
              } else {
                output.source = new RawSource(output.code);
              }

              let commentsFilename;

              if (output.extractedComments && output.extractedComments.length > 0) {
                commentsFilename = _this.options.extractComments.filename || '[file].LICENSE.txt[query]';
                let query = '';
                let filename = name;
                const querySplit = filename.indexOf('?');

                if (querySplit >= 0) {
                  query = filename.substr(querySplit);
                  filename = filename.substr(0, querySplit);
                }

                const lastSlashIndex = filename.lastIndexOf('/');
                const basename = lastSlashIndex === -1 ? filename : filename.substr(lastSlashIndex + 1);
                const data = {
                  filename,
                  basename,
                  query
                };
                commentsFilename = compilation.getPath(commentsFilename, data);
                output.commentsFilename = commentsFilename;
                let banner; // Add a banner to the original file

                if (_this.options.extractComments.banner !== false) {
                  banner = _this.options.extractComments.banner || `For license information please see ${_path().default.relative(_path().default.dirname(name), commentsFilename).replace(/\\/g, '/')}`;

                  if (typeof banner === 'function') {
                    banner = banner(commentsFilename);
                  }

                  if (banner) {
                    output.source = new ConcatSource(shebang ? `${shebang}\n` : '', `/*! ${banner} */\n`, output.source);
                    output.banner = banner;
                    output.shebang = shebang;
                  }
                }

                const extractedCommentsString = output.extractedComments.sort().join('\n\n');
                output.extractedCommentsSource = new RawSource(`${extractedCommentsString}\n`);
              }

              yield cache.store(_objectSpread(_objectSpread({}, output), cacheData));
            } // TODO `...` required only for webpack@4


            const newInfo = _objectSpread(_objectSpread({}, info), {}, {
              minimized: true
            });

            const _output = output,
                  source = _output.source,
                  extractedCommentsSource = _output.extractedCommentsSource; // Write extracted comments to commentsFilename

            if (extractedCommentsSource) {
              const _output2 = output,
                    commentsFilename = _output2.commentsFilename; // TODO `...` required only for webpack@4

              newInfo.related = _objectSpread({
                license: commentsFilename
              }, info.related);
              allExtractedComments.set(name, {
                extractedCommentsSource,
                commentsFilename
              });
            }

            TerserPlugin.updateAsset(compilation, name, source, newInfo);
          })));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      yield Promise.all(scheduledTasks);

      if (worker) {
        yield worker.end();
      }

      yield Array.from(allExtractedComments).sort().reduce( /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(function* (previousPromise, [from, value]) {
          const previous = yield previousPromise;
          const commentsFilename = value.commentsFilename,
                extractedCommentsSource = value.extractedCommentsSource;

          if (previous && previous.commentsFilename === commentsFilename) {
            const previousFrom = previous.from,
                  prevSource = previous.source;
            const mergedName = `${previousFrom}|${from}`;
            const cacheData = {
              target: 'comments'
            };

            if (TerserPlugin.isWebpack4()) {
              const _compilation$outputOp = compilation.outputOptions,
                    hashSalt = _compilation$outputOp.hashSalt,
                    hashDigest = _compilation$outputOp.hashDigest,
                    hashDigestLength = _compilation$outputOp.hashDigestLength,
                    hashFunction = _compilation$outputOp.hashFunction;

              const previousHash = _webpack().util.createHash(hashFunction);

              const hash = _webpack().util.createHash(hashFunction);

              if (hashSalt) {
                previousHash.update(hashSalt);
                hash.update(hashSalt);
              }

              previousHash.update(prevSource.source());
              hash.update(extractedCommentsSource.source());
              const previousDigest = previousHash.digest(hashDigest);
              const digest = hash.digest(hashDigest);
              cacheData.cacheKeys = {
                mergedName,
                previousContentHash: previousDigest.substr(0, hashDigestLength),
                contentHash: digest.substr(0, hashDigestLength)
              };
              cacheData.inputSource = extractedCommentsSource;
            } else {
              const mergedInputSource = [prevSource, extractedCommentsSource];
              cacheData.name = `${commentsFilename}|${mergedName}`;
              cacheData.inputSource = mergedInputSource;
            }

            let output = yield cache.get(cacheData, {
              ConcatSource
            });

            if (!output) {
              output = new ConcatSource(Array.from(new Set([...prevSource.source().split('\n\n'), ...extractedCommentsSource.source().split('\n\n')])).join('\n\n'));
              yield cache.store(_objectSpread(_objectSpread({}, cacheData), {}, {
                output
              }));
            }

            TerserPlugin.updateAsset(compilation, commentsFilename, output);
            return {
              commentsFilename,
              from: mergedName,
              source: output
            };
          }

          const existingAsset = TerserPlugin.getAsset(compilation, commentsFilename);

          if (existingAsset) {
            return {
              commentsFilename,
              from: commentsFilename,
              source: existingAsset.source
            };
          }

          TerserPlugin.emitAsset(compilation, commentsFilename, extractedCommentsSource);
          return {
            commentsFilename,
            from,
            source: extractedCommentsSource
          };
        });

        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }(), Promise.resolve());
    })();
  }

  static getEcmaVersion(environment) {
    // ES 6th
    if (environment.arrowFunction || environment.const || environment.destructuring || environment.forOf || environment.module) {
      return 2015;
    } // ES 11th


    if (environment.bigIntLiteral || environment.dynamicImport) {
      return 2020;
    }

    return 5;
  }

  apply(compiler) {
    const _compiler$options = compiler.options,
          devtool = _compiler$options.devtool,
          output = _compiler$options.output,
          plugins = _compiler$options.plugins;
    this.options.sourceMap = typeof this.options.sourceMap === 'undefined' ? devtool && !devtool.includes('eval') && !devtool.includes('cheap') && (devtool.includes('source-map') || // Todo remove when `webpack@4` support will be dropped
    devtool.includes('sourcemap')) || plugins && plugins.some(plugin => plugin instanceof _webpack().SourceMapDevToolPlugin && plugin.options && plugin.options.columns) : Boolean(this.options.sourceMap);

    if (typeof this.options.terserOptions.module === 'undefined' && typeof output.module !== 'undefined') {
      this.options.terserOptions.module = output.module;
    }

    if (typeof this.options.terserOptions.ecma === 'undefined') {
      this.options.terserOptions.ecma = TerserPlugin.getEcmaVersion(output.environment || {});
    }

    const pluginName = this.constructor.name;
    const weakCache = TerserPlugin.isWebpack4() && (this.options.cache === true || typeof this.options.cache === 'string') ? new WeakMap() : // eslint-disable-next-line no-undefined
    undefined;
    compiler.hooks.compilation.tap(pluginName, compilation => {
      if (this.options.sourceMap) {
        compilation.hooks.buildModule.tap(pluginName, moduleArg => {
          // to get detailed location info about errors
          // eslint-disable-next-line no-param-reassign
          moduleArg.useSourceMap = true;
        });
      }

      if (TerserPlugin.isWebpack4()) {
        // eslint-disable-next-line global-require
        const CacheEngine = require('./Webpack4Cache').default;

        const mainTemplate = compilation.mainTemplate,
              chunkTemplate = compilation.chunkTemplate;
        const data = (0, _serializeJavascript().default)({
          terser: _package.default.version,
          terserOptions: this.options.terserOptions
        }); // Regenerate `contenthash` for minified assets

        for (var _i = 0, _arr = [mainTemplate, chunkTemplate]; _i < _arr.length; _i++) {
          const template = _arr[_i];
          template.hooks.hashForChunk.tap(pluginName, hash => {
            hash.update('TerserPlugin');
            hash.update(data);
          });
        }

        compilation.hooks.optimizeChunkAssets.tapPromise(pluginName, assets => this.optimize(compiler, compilation, assets, CacheEngine, weakCache));
      } else {
        // eslint-disable-next-line global-require
        const CacheEngine = require('./Webpack5Cache').default; // eslint-disable-next-line global-require


        const Compilation = require('webpack/lib/Compilation');

        const hooks = _webpack().javascript.JavascriptModulesPlugin.getCompilationHooks(compilation);

        const data = (0, _serializeJavascript().default)({
          terser: _package.default.version,
          terserOptions: this.options.terserOptions
        });
        hooks.chunkHash.tap(pluginName, (chunk, hash) => {
          hash.update('TerserPlugin');
          hash.update(data);
        });
        compilation.hooks.processAssets.tapPromise({
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE
        }, assets => this.optimize(compiler, compilation, assets, CacheEngine));
        compilation.hooks.statsPrinter.tap(pluginName, stats => {
          stats.hooks.print.for('asset.info.minimized').tap('terser-webpack-plugin', (minimized, {
            green,
            formatFlag
          }) => // eslint-disable-next-line no-undefined
          minimized ? green(formatFlag('minimized')) : undefined);
        });
      }
    });
  }

}

var _default = TerserPlugin;
exports.default = _default;