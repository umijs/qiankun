"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doPrefetchStrategy = doPrefetchStrategy;
exports.prefetchImmediately = prefetchImmediately;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _importHtmlEntry = require("import-html-entry");
var _singleSpa = require("single-spa");
/**
 * @author Kuitos
 * @since 2019-02-26
 */

function idleCall(cb, start) {
  cb({
    didTimeout: false,
    timeRemaining: function timeRemaining() {
      return Math.max(0, 50 - (Date.now() - start));
    }
  });
}
// RIC and shim for browsers setTimeout() without it idle
var requestIdleCallback;
if (typeof window.requestIdleCallback !== 'undefined') {
  requestIdleCallback = window.requestIdleCallback;
} else if (typeof window.MessageChannel !== 'undefined') {
  // The first recommendation is to use MessageChannel because
  // it does not have the 4ms delay of setTimeout
  var channel = new MessageChannel();
  var port = channel.port2;
  var tasks = [];
  channel.port1.onmessage = function (_ref) {
    var data = _ref.data;
    var task = tasks.shift();
    if (!task) {
      return;
    }
    idleCall(task, data.start);
  };
  requestIdleCallback = function requestIdleCallback(cb) {
    tasks.push(cb);
    port.postMessage({
      start: Date.now()
    });
  };
} else {
  requestIdleCallback = function requestIdleCallback(cb) {
    return setTimeout(idleCall, 0, cb, Date.now());
  };
}
var isSlowNetwork = navigator.connection ? navigator.connection.saveData || navigator.connection.type !== 'wifi' && navigator.connection.type !== 'ethernet' && /([23])g/.test(navigator.connection.effectiveType) : false;
/**
 * prefetch assets, do nothing while in mobile network
 * @param entry
 * @param opts
 */
function prefetch(entry, opts) {
  if (!navigator.onLine || isSlowNetwork) {
    // Don't prefetch if in a slow network or offline
    return;
  }
  requestIdleCallback( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var _yield$importEntry, getExternalScripts, getExternalStyleSheets;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _importHtmlEntry.importEntry)(entry, opts);
        case 2:
          _yield$importEntry = _context.sent;
          getExternalScripts = _yield$importEntry.getExternalScripts;
          getExternalStyleSheets = _yield$importEntry.getExternalStyleSheets;
          requestIdleCallback(getExternalStyleSheets);
          requestIdleCallback(getExternalScripts);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
}
function prefetchAfterFirstMounted(apps, opts) {
  window.addEventListener('single-spa:first-mount', function listener() {
    var notLoadedApps = apps.filter(function (app) {
      return (0, _singleSpa.getAppStatus)(app.name) === _singleSpa.NOT_LOADED;
    });
    if (process.env.NODE_ENV === 'development') {
      var mountedApps = (0, _singleSpa.getMountedApps)();
      console.log("[qiankun] prefetch starting after ".concat(mountedApps, " mounted..."), notLoadedApps);
    }
    notLoadedApps.forEach(function (_ref3) {
      var entry = _ref3.entry;
      return prefetch(entry, opts);
    });
    window.removeEventListener('single-spa:first-mount', listener);
  });
}
function prefetchImmediately(apps, opts) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[qiankun] prefetch starting for apps...', apps);
  }
  apps.forEach(function (_ref4) {
    var entry = _ref4.entry;
    return prefetch(entry, opts);
  });
}
function doPrefetchStrategy(apps, prefetchStrategy, importEntryOpts) {
  var appsName2Apps = function appsName2Apps(names) {
    return apps.filter(function (app) {
      return names.includes(app.name);
    });
  };
  if (Array.isArray(prefetchStrategy)) {
    prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy), importEntryOpts);
  } else if ((0, _isFunction2.default)(prefetchStrategy)) {
    (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
      var _yield$prefetchStrate, _yield$prefetchStrate2, criticalAppNames, _yield$prefetchStrate3, minorAppsName;
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return prefetchStrategy(apps);
          case 2:
            _yield$prefetchStrate = _context2.sent;
            _yield$prefetchStrate2 = _yield$prefetchStrate.criticalAppNames;
            criticalAppNames = _yield$prefetchStrate2 === void 0 ? [] : _yield$prefetchStrate2;
            _yield$prefetchStrate3 = _yield$prefetchStrate.minorAppsName;
            minorAppsName = _yield$prefetchStrate3 === void 0 ? [] : _yield$prefetchStrate3;
            prefetchImmediately(appsName2Apps(criticalAppNames), importEntryOpts);
            prefetchAfterFirstMounted(appsName2Apps(minorAppsName), importEntryOpts);
          case 9:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  } else {
    switch (prefetchStrategy) {
      case true:
        prefetchAfterFirstMounted(apps, importEntryOpts);
        break;
      case 'all':
        prefetchImmediately(apps, importEntryOpts);
        break;
      default:
        break;
    }
  }
}