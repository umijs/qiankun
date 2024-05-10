"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  loadMicroApp: true,
  registerMicroApps: true,
  start: true,
  initGlobalState: true,
  __internalGetCurrentRunningApp: true,
  prefetchApps: true
};
Object.defineProperty(exports, "__internalGetCurrentRunningApp", {
  enumerable: true,
  get: function get() {
    return _sandbox.getCurrentRunningApp;
  }
});
Object.defineProperty(exports, "initGlobalState", {
  enumerable: true,
  get: function get() {
    return _globalState.initGlobalState;
  }
});
Object.defineProperty(exports, "loadMicroApp", {
  enumerable: true,
  get: function get() {
    return _apis.loadMicroApp;
  }
});
Object.defineProperty(exports, "prefetchApps", {
  enumerable: true,
  get: function get() {
    return _prefetch.prefetchImmediately;
  }
});
Object.defineProperty(exports, "registerMicroApps", {
  enumerable: true,
  get: function get() {
    return _apis.registerMicroApps;
  }
});
Object.defineProperty(exports, "start", {
  enumerable: true,
  get: function get() {
    return _apis.start;
  }
});
var _apis = require("./apis");
var _globalState = require("./globalState");
var _sandbox = require("./sandbox");
var _errorHandler = require("./errorHandler");
Object.keys(_errorHandler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _errorHandler[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _errorHandler[key];
    }
  });
});
var _effects = require("./effects");
Object.keys(_effects).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _effects[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _effects[key];
    }
  });
});
var _interfaces = require("./interfaces");
Object.keys(_interfaces).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interfaces[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _interfaces[key];
    }
  });
});
var _prefetch = require("./prefetch");