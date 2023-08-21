'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var runtime = require('@umijs/runtime');
var React = require('react');
var ReactDOM = require('react-dom');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var ReactDOM__namespace = /*#__PURE__*/_interopNamespace(ReactDOM);

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function getRootContainer(opts) {
  var _iterator = _createForOfIteratorHelper(opts.routes),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var route = _step.value;
      if (route.path === opts.path) return route.component;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function renderClient(opts) {
  var path = opts.path;

  if (!path) {
    // @ts-ignore
    path = window.g_path;
  } // 暂不支持子路由


  var _iterator2 = _createForOfIteratorHelper(opts.routes),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var route = _step2.value;

      if (route.routes) {
        throw new Error("Render failed, child routes is not supported in mpa renderer.");
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var RouteComponent = getRootContainer({
    routes: opts.routes,
    path: path
  });

  if (!RouteComponent) {
    throw new Error("Render failed, route of path ".concat(path, " not found."));
  }

  var rootContainer = opts.plugin.applyPlugins({
    type: runtime.ApplyPluginsType.modify,
    key: 'rootContainer',
    initialValue: /*#__PURE__*/React.createElement(RouteComponent, {
      history: opts.history,
      routes: opts.routes,
      plugin: opts.plugin,
      defaultTitle: opts.defaultTitle
    }),
    args: {
      history: opts.history,
      routes: opts.routes,
      plugin: opts.plugin
    }
  });

  if (opts.rootElement) {
    var rootElement = typeof opts.rootElement === 'string' ? document.getElementById(opts.rootElement) : opts.rootElement;

    var callback = opts.callback || function () {}; // @ts-ignore


    ReactDOM__namespace[window.g_useSSR ? 'hydrate' : 'render'](rootContainer, rootElement, callback);
  } else {
    return rootContainer;
  }
}

exports.renderClient = renderClient;
