"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  _getHtmlGenerator: true,
  utils: true,
  defineConfig: true,
  Service: true
};
Object.defineProperty(exports, "_getHtmlGenerator", {
  enumerable: true,
  get: function get() {
    return _htmlUtils().getHtmlGenerator;
  }
});
Object.defineProperty(exports, "defineConfig", {
  enumerable: true,
  get: function get() {
    return _defineConfig.defineConfig;
  }
});
Object.defineProperty(exports, "Service", {
  enumerable: true,
  get: function get() {
    return _ServiceWithBuiltIn.Service;
  }
});
exports.utils = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _htmlUtils() {
  const data = require("@umijs/preset-built-in/lib/plugins/commands/htmlUtils");

  _htmlUtils = function _htmlUtils() {
    return data;
  };

  return data;
}

function utils() {
  const data = _interopRequireWildcard(require("@umijs/utils"));

  utils = function utils() {
    return data;
  };

  return data;
}

Object.defineProperty(exports, "utils", {
  enumerable: true,
  get: function get() {
    return utils();
  }
});

var _defineConfig = require("./defineConfig");

var _ServiceWithBuiltIn = require("./ServiceWithBuiltIn");

var _runtime = require("@umijs/runtime");

Object.keys(_runtime).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _runtime[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _runtime[key];
    }
  });
});

var _types = require("@umijs/types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }