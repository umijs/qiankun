var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/depBuilder/getESBuildEntry.ts
var getESBuildEntry_exports = {};
__export(getESBuildEntry_exports, {
  getESBuildEntry: () => getESBuildEntry
});
module.exports = __toCommonJS(getESBuildEntry_exports);
var import_constants = require("../constants");
var ES_INTEROP_FUNC = `__exportStar`;
var ES_INTEROP_HELPER = `
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
var ${ES_INTEROP_FUNC} = (this && this.__exportStar) || function(m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
`;
function getESBuildEntry(opts) {
  return `
(function() {
/******/   "use strict";
/******/   var __webpack_modules__ = ({});
/************************************************************************/
/******/   // The module cache
/******/   var __webpack_module_cache__ = {};
/******/
/******/   // The require function
/******/   function __webpack_require__(moduleId) {
/******/     // Check if module is in cache
/******/     var cachedModule = __webpack_module_cache__[moduleId];
/******/     if (cachedModule !== undefined) {
/******/       return cachedModule.exports;
/******/     }
/******/     // Create a new module (and put it into the cache)
/******/     var module = __webpack_module_cache__[moduleId] = {
/******/       id: moduleId,
/******/       loaded: false,
/******/       exports: {}
/******/     };
/******/
/******/     // Execute the module function
/******/     __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/     // Flag the module as loaded
/******/     module.loaded = true;
/******/
/******/     // Return the exports of the module
/******/     return module.exports;
/******/   }
/******/
/******/   // expose the modules object (__webpack_modules__)
/******/   __webpack_require__.m = __webpack_modules__;
/******/
/************************************************************************/
/******/   /* webpack/runtime/compat get default export */
/******/   !function() {
/******/     // getDefaultExport function for compatibility with non-harmony modules
/******/     __webpack_require__.n = function(module) {
/******/       var getter = module && module.__esModule ?
/******/         function() { return module['default']; } :
/******/         function() { return module; };
/******/       __webpack_require__.d(getter, { a: getter });
/******/       return getter;
/******/     };
/******/   }();
/******/
/******/   /* webpack/runtime/define property getters */
/******/   !function() {
/******/     // define getter functions for harmony exports
/******/     __webpack_require__.d = function(exports, definition) {
/******/       for(var key in definition) {
/******/         if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/           Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/         }
/******/       }
/******/     };
/******/   }();
/******/
/******/   /* webpack/runtime/ensure chunk */
/******/   !function() {
/******/     __webpack_require__.f = {};
/******/     // This file contains only the entry chunk.
/******/     // The chunk loading function for additional chunks
/******/     __webpack_require__.e = function(chunkId) {
/******/       return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
/******/         __webpack_require__.f[key](chunkId, promises);
/******/         return promises;
/******/       }, []));
/******/     };
/******/   }();
/******/
/******/   /* webpack/runtime/get javascript chunk filename */
/******/   !function() {
/******/     // This function allow to reference async chunks
/******/     __webpack_require__.u = function(chunkId) {
/******/       // return url for filenames based on template
/******/       return "" + "mf-dep____vendor" + "." + "8b5e340b" + ".js";
/******/     };
/******/   }();
/******/
/******/   /* webpack/runtime/get mini-css chunk filename */
/******/   !function() {
/******/     // This function allow to reference all chunks
/******/     __webpack_require__.miniCssF = function(chunkId) {
/******/       // return url for filenames based on template
/******/       return undefined;
/******/     };
/******/   }();
/******/
/******/   /* webpack/runtime/hasOwnProperty shorthand */
/******/   !function() {
/******/     __webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/   }();
/******/
/******/   /* webpack/runtime/load script */
/******/   !function() {
/******/     var inProgress = {};
/******/     // data-webpack is not used as build has no uniqueName
/******/     // loadScript function to load a script via script tag
/******/     __webpack_require__.l = function(url, done, key, chunkId) {
/******/       if(inProgress[url]) { inProgress[url].push(done); return; }
/******/       var script, needAttach;
/******/       if(key !== undefined) {
/******/         var scripts = document.getElementsByTagName("script");
/******/         for(var i = 0; i < scripts.length; i++) {
/******/           var s = scripts[i];
/******/           if(s.getAttribute("src") == url) { script = s; break; }
/******/         }
/******/       }
/******/       if(!script) {
/******/         needAttach = true;
/******/         script = document.createElement('script');
/******/
/******/         script.charset = 'utf-8';
/******/         script.timeout = 120;
/******/         if (__webpack_require__.nc) {
/******/           script.setAttribute("nonce", __webpack_require__.nc);
/******/         }
/******/
/******/         script.src = url;
/******/       }
/******/       inProgress[url] = [done];
/******/       var onScriptComplete = function(prev, event) {
/******/         // avoid mem leaks in IE.
/******/         script.onerror = script.onload = null;
/******/         clearTimeout(timeout);
/******/         var doneFns = inProgress[url];
/******/         delete inProgress[url];
/******/         script.parentNode && script.parentNode.removeChild(script);
/******/         doneFns && doneFns.forEach(function(fn) { return fn(event); });
/******/         if(prev) return prev(event);
/******/       }
/******/       ;
/******/       var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/       script.onerror = onScriptComplete.bind(null, script.onerror);
/******/       script.onload = onScriptComplete.bind(null, script.onload);
/******/       needAttach && document.head.appendChild(script);
/******/     };
/******/   }();
/******/
/******/   /* webpack/runtime/make namespace object */
/******/   !function() {
/******/     // define __esModule on exports
/******/     __webpack_require__.r = function(exports) {
/******/       if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/         Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/       }
/******/       Object.defineProperty(exports, '__esModule', { value: true });
/******/     };
/******/   }();
/******/
/******/   /* webpack/runtime/node module decorator */
/******/   !function() {
/******/     __webpack_require__.nmd = function(module) {
/******/       module.paths = [];
/******/       if (!module.children) module.children = [];
/******/       return module;
/******/     };
/******/   }();
/******/
/******/   /* webpack/runtime/publicPath */
/******/   !function() {
/******/     __webpack_require__.p = "/";
/******/   }();
/******/
/******/   /* webpack/runtime/jsonp chunk loading */
/******/   !function() {
/******/     // no baseURI
/******/
/******/     // object to store loaded and loading chunks
/******/     // undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/     // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/     var installedChunks = {
/******/       "mf-dep_mf": 0
/******/     };
/******/
/******/     __webpack_require__.f.j = function(chunkId, promises) {
/******/         // JSONP chunk loading for javascript
/******/         var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/         if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/           // a Promise means "currently loading".
/******/           if(installedChunkData) {
/******/             promises.push(installedChunkData[2]);
/******/           } else {
/******/             if(true) { // all chunks have JS
/******/               // setup Promise in chunk cache
/******/               var promise = new Promise(function(resolve, reject) { installedChunkData = installedChunks[chunkId] = [resolve, reject]; });
/******/               promises.push(installedChunkData[2] = promise);
/******/
/******/               // start chunk loading
/******/               var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/               // create error before stack unwound to get useful stacktrace later
/******/               var error = new Error();
/******/               var loadingEnded = function(event) {
/******/                 if(__webpack_require__.o(installedChunks, chunkId)) {
/******/                   installedChunkData = installedChunks[chunkId];
/******/                   if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/                   if(installedChunkData) {
/******/                     var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/                     var realSrc = event && event.target && event.target.src;
/******/                     error.message = 'Loading chunk ' + chunkId + ' failed.\\n(' + errorType + ': ' + realSrc + ')';
/******/                     error.name = 'ChunkLoadError';
/******/                     error.type = errorType;
/******/                     error.request = realSrc;
/******/                     installedChunkData[1](error);
/******/                   }
/******/                 }
/******/               };
/******/               __webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/             } else installedChunks[chunkId] = 0;
/******/           }
/******/         }
/******/     };
/******/
/******/     // no prefetching
/******/
/******/     // no preloaded
/******/
/******/     // no HMR
/******/
/******/     // no HMR manifest
/******/
/******/     // no on chunks loaded
/******/
/******/     // install a JSONP callback for chunk loading
/******/     var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/       var chunkIds = data[0];
/******/       var moreModules = data[1];
/******/       var runtime = data[2];
/******/       // add "moreModules" to the modules object,
/******/       // then flag all "chunkIds" as loaded and fire callback
/******/       var moduleId, chunkId, i = 0;
/******/       if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/         for(moduleId in moreModules) {
/******/           if(__webpack_require__.o(moreModules, moduleId)) {
/******/             __webpack_require__.m[moduleId] = moreModules[moduleId];
/******/           }
/******/         }
/******/         if(runtime) var result = runtime(__webpack_require__);
/******/       }
/******/       if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/       for(;i < chunkIds.length; i++) {
/******/         chunkId = chunkIds[i];
/******/         if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/           installedChunks[chunkId][0]();
/******/         }
/******/         installedChunks[chunkIds[i]] = 0;
/******/       }
/******/
/******/     }
/******/
/******/     var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/     chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/     chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/   }();
/******/
/************************************************************************/
var __webpack_exports__ = {};
(function() {
  var exports = __webpack_exports__;
${ES_INTEROP_HELPER}
  var moduleMap = {
${opts.deps.map(getDepModuleStr).join(",\n")}
  };
  var get = function(module, getScope) {
    __webpack_require__.R = getScope;
    getScope = (
      __webpack_require__.o(moduleMap, module)
        ? moduleMap[module]()
        : Promise.resolve().then(function() {
          throw new Error('Module "' + module + '" does not exist in container.');
        })
    );
    __webpack_require__.R = undefined;
    return getScope;
  };
  var init = function(shareScope, initScope) {
    if (!__webpack_require__.S) return;
    var oldScope = __webpack_require__.S["default"];
    var name = "default"
    if(oldScope && oldScope !== shareScope) throw new Error("Container initialization failed as it has already been initialized with a different share scope");
    __webpack_require__.S[name] = shareScope;
    return __webpack_require__.I(name, initScope);
  };
  __webpack_require__.d(exports, {
    get: function() { return get; },
    init: function() { return init; }
  });
  self.${opts.mfName} = __webpack_exports__;
})();
})();
  `;
}
function getDepModuleStr(dep) {
  return `
"./${dep.file}": function() {
  return new Promise(resolve => {
    import('./${import_constants.MF_VA_PREFIX}${dep.normalizedFile}.js').then(module => {
      module.default && ${ES_INTEROP_FUNC}(module, module.default);
      resolve(() => module.default || module);
    });
  })
}
  `.trim();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getESBuildEntry
});
