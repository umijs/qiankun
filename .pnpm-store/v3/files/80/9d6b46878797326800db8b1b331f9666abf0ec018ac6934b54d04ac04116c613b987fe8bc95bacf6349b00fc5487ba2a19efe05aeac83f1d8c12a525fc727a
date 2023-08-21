"use strict";

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
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

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

const compareModulesByIdentifier = _webpack().util.comparators.compareModulesByIdentifier;

const getCssChunkObject = (mainChunk, compilation) => {
  const obj = {};
  const chunkGraph = compilation.chunkGraph;

  var _iterator = _createForOfIteratorHelper(mainChunk.getAllAsyncChunks()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const chunk = _step.value;
      const modules = chunkGraph.getOrderedChunkModulesIterable(chunk, compareModulesByIdentifier);

      var _iterator2 = _createForOfIteratorHelper(modules),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          const module = _step2.value;

          if (module.type === _utils.MODULE_TYPE) {
            obj[chunk.id] = 1;
            break;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return obj;
};

module.exports = class CssLoadingRuntimeModule extends _webpack().RuntimeModule {
  constructor(runtimeRequirements) {
    super('css loading', 10);
    this.runtimeRequirements = runtimeRequirements;
  }

  generate() {
    const chunk = this.chunk,
          compilation = this.compilation,
          runtimeRequirements = this.runtimeRequirements;
    const runtimeTemplate = compilation.runtimeTemplate,
          crossOriginLoading = compilation.outputOptions.crossOriginLoading;
    const chunkMap = getCssChunkObject(chunk, compilation);
    const withLoading = runtimeRequirements.has(_webpack().RuntimeGlobals.ensureChunkHandlers) && Object.keys(chunkMap).length > 0;
    const withHmr = runtimeRequirements.has(_webpack().RuntimeGlobals.hmrDownloadUpdateHandlers);
    if (!withLoading && !withHmr) return null;
    return _webpack().Template.asString([`var createStylesheet = ${runtimeTemplate.basicFunction('fullhref, resolve, reject', ['var linkTag = document.createElement("link");', 'linkTag.rel = "stylesheet";', 'linkTag.type = "text/css";', 'linkTag.onload = resolve;', 'linkTag.onerror = function(event) {', _webpack().Template.indent(['var request = event && event.target && event.target.src || fullhref;', 'var err = new Error("Loading CSS chunk " + chunkId + " failed.\\n(" + request + ")");', 'err.code = "CSS_CHUNK_LOAD_FAILED";', 'err.request = request;', 'linkTag.parentNode.removeChild(linkTag)', 'reject(err);']), '};', 'linkTag.href = fullhref;', crossOriginLoading ? _webpack().Template.asString([`if (linkTag.href.indexOf(window.location.origin + '/') !== 0) {`, _webpack().Template.indent(`linkTag.crossOrigin = ${JSON.stringify(crossOriginLoading)};`), '}']) : '', 'var head = document.getElementsByTagName("head")[0];', 'head.appendChild(linkTag);', 'return linkTag;'])};`, `var findStylesheet = ${runtimeTemplate.basicFunction('href, fullhref', ['var existingLinkTags = document.getElementsByTagName("link");', 'for(var i = 0; i < existingLinkTags.length; i++) {', _webpack().Template.indent(['var tag = existingLinkTags[i];', 'var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");', 'if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;']), '}', 'var existingStyleTags = document.getElementsByTagName("style");', 'for(var i = 0; i < existingStyleTags.length; i++) {', _webpack().Template.indent(['var tag = existingStyleTags[i];', 'var dataHref = tag.getAttribute("data-href");', 'if(dataHref === href || dataHref === fullhref) return tag;']), '}'])};`, `var loadStylesheet = ${runtimeTemplate.basicFunction('chunkId', `return new Promise(${runtimeTemplate.basicFunction('resolve, reject', [`var href = ${_webpack().RuntimeGlobals.require}.miniCssF(chunkId);`, `var fullhref = ${_webpack().RuntimeGlobals.publicPath} + href;`, 'if(findStylesheet(href, fullhref)) return resolve();', 'createStylesheet(fullhref, resolve, reject);'])});`)}`, withLoading ? _webpack().Template.asString(['// object to store loaded CSS chunks', 'var installedCssChunks = {', _webpack().Template.indent(chunk.ids.map(id => `${JSON.stringify(id)}: 0`).join(',\n')), '};', '', `${_webpack().RuntimeGlobals.ensureChunkHandlers}.miniCss = ${runtimeTemplate.basicFunction('chunkId, promises', [`var cssChunks = ${JSON.stringify(chunkMap)};`, 'if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);', 'else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {', _webpack().Template.indent([`promises.push(installedCssChunks[chunkId] = loadStylesheet(chunkId).then(${runtimeTemplate.basicFunction('', 'installedCssChunks[chunkId] = 0;')}, ${runtimeTemplate.basicFunction('e', ['delete installedCssChunks[chunkId];', 'throw e;'])}));`]), '}'])};`]) : '// no chunk loading', '', withHmr ? _webpack().Template.asString(['var oldTags = [];', 'var newTags = [];', `var applyHandler = ${runtimeTemplate.basicFunction('options', [`return { dispose: ${runtimeTemplate.basicFunction('', ['for(var i = 0; i < oldTags.length; i++) {', _webpack().Template.indent(['var oldTag = oldTags[i];', 'if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);']), '}', 'oldTags.length = 0;'])}, apply: ${runtimeTemplate.basicFunction('', ['for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";', 'newTags.length = 0;'])} };`])}`, `${_webpack().RuntimeGlobals.hmrDownloadUpdateHandlers}.miniCss = ${runtimeTemplate.basicFunction('chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList', ['applyHandlers.push(applyHandler);', `chunkIds.forEach(${runtimeTemplate.basicFunction('chunkId', [`var href = ${_webpack().RuntimeGlobals.require}.miniCssF(chunkId);`, `var fullhref = ${_webpack().RuntimeGlobals.publicPath} + href;`, 'var oldTag = findStylesheet(href, fullhref);', 'if(!oldTag) return;', `promises.push(new Promise(${runtimeTemplate.basicFunction('resolve, reject', [`var tag = createStylesheet(fullhref, ${runtimeTemplate.basicFunction('', ['tag.as = "style";', 'tag.rel = "preload";', 'resolve();'])}, reject);`, 'oldTags.push(oldTag);', 'newTags.push(tag);'])}));`])});`])}`]) : '// no hmr']);
  }

};