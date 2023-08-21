"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const SEPARATOR = '^^^';
const EMPTY_PATH = '_'; // TODO:
// 1. support dynamic import (and levels)
// 2. require().default -> import in production? (for tree-shaking)

function _default({
  routes,
  config,
  cwd,
  isServer
}) {
  // 因为要往 routes 里加无用的信息，所以必须 deep clone 一下，避免污染
  const clonedRoutes = _utils().lodash.cloneDeep(routes);

  if (config.dynamicImport) {
    patchRoutes(clonedRoutes);
  }

  function patchRoutes(routes) {
    routes.forEach(patchRoute);
  }

  function patchRoute(route) {
    if (route.component && !isFunctionComponent(route.component)) {
      const webpackChunkName = (0, _utils().routeToChunkName)({
        route,
        cwd
      }); // 解决 SSR 开启动态加载后，页面闪烁问题

      if (isServer && (config === null || config === void 0 ? void 0 : config.dynamicImport)) {
        route._chunkName = webpackChunkName;
      }

      route.component = [route.component, webpackChunkName, route.path || EMPTY_PATH].join(SEPARATOR);
    }

    if (route.routes) {
      patchRoutes(route.routes);
    }
  }

  function isFunctionComponent(component) {
    return /^\((.+)?\)(\s+)?=>/.test(component) || /^function([^\(]+)?\(([^\)]+)?\)([^{]+)?{/.test(component);
  }

  function replacer(key, value) {
    switch (key) {
      case 'component':
        if (isFunctionComponent(value)) return value;

        if (config.dynamicImport) {
          const _value$split = value.split(SEPARATOR),
                _value$split2 = _slicedToArray(_value$split, 2),
                component = _value$split2[0],
                webpackChunkName = _value$split2[1];

          let loading = '';

          if (config.dynamicImport.loading) {
            loading = `, loading: LoadingComponent`;
          } // server routes can't using import() for avoiding OOM when `dynamicImport`


          return isServer ? `require('${component}').default` : `dynamic({ loader: () => import(/* webpackChunkName: '${webpackChunkName}' */'${component}')${loading}})`;
        } else {
          return `require('${value}').default`;
        }

      case 'wrappers':
        const wrappers = value.map(wrapper => {
          if (config.dynamicImport) {
            let loading = '';

            if (config.dynamicImport.loading) {
              loading = `, loading: LoadingComponent`;
            }

            return isServer ? `require('${wrapper}').default` : `dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'${wrapper}')${loading}})`;
          } else {
            return `require('${wrapper}').default`;
          }
        });
        return `[${wrappers.join(', ')}]`;

      default:
        return value;
    }
  }

  return JSON.stringify(clonedRoutes, replacer, 2).replace(/\"component\": (\"(.+?)\")/g, (global, m1, m2) => {
    return `"component": ${m2.replace(/\^/g, '"')}`;
  }).replace(/\"wrappers\": (\"(.+?)\")/g, (global, m1, m2) => {
    return `"wrappers": ${m2.replace(/\^/g, '"')}`;
  }).replace(/\\r\\n/g, '\r\n').replace(/\\n/g, '\r\n');
}

function lastSlash(str) {
  return str[str.length - 1] === '/' ? str : `${str}/`;
}