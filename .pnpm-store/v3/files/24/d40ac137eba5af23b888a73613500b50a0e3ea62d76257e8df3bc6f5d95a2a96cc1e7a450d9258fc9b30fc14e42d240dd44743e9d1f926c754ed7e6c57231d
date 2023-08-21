"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DUMI_ROOT_FLAG = void 0;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
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
function _slash() {
  const data = _interopRequireDefault(require("slash2"));
  _slash = function _slash() {
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
var _getRouteConfigFromDir = _interopRequireDefault(require("./getRouteConfigFromDir"));
var _loader = _interopRequireDefault(require("../theme/loader"));
var _decorator = _interopRequireDefault(require("./decorator"));
var _integrate = require("./decorator/integrate");
const _excluded = ["component"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
const debug = (0, _utils().createDebug)('dumi:routes:get');
const DUMI_ROOT_FLAG = '__dumiRoot';
exports.DUMI_ROOT_FLAG = DUMI_ROOT_FLAG;
var _default = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (api, opts) {
    var _api$args, _yield$api$applyPlugi;
    const paths = api.paths;
    const config = [];
    const childRoutes = [];
    const exampleRoutePrefix = opts.mode === 'site' ? '/_' : '/_examples/';
    const theme = yield (0, _loader.default)();
    const userRoutes = opts.isIntegrate || ((_api$args = api.args) === null || _api$args === void 0 ? void 0 : _api$args.dumi) !== undefined ? (_yield$api$applyPlugi = yield api.applyPlugins({
      key: 'dumi.getRootRoute',
      type: api.ApplyPluginsType.modify,
      initialValue: api.userConfig.routes
    })) === null || _yield$api$applyPlugi === void 0 ? void 0 : _yield$api$applyPlugi.routes : api.userConfig.routes;
    if (userRoutes) {
      // only apply user's routes if there has routes config
      childRoutes.push(...userRoutes.map(_ref2 => {
        let component = _ref2.component,
          routeOpts = _objectWithoutProperties(_ref2, _excluded);
        return _objectSpread({
          component: _path().default.isAbsolute(component) ? (0, _slash().default)(_path().default.relative(paths.cwd, component)) : component
        }, routeOpts);
      }));
      debug('getRouteConfigFromUserConfig');
    } else {
      // generate routes automatically if there has no routes config
      // find routes from include path & find examples from example path
      opts.resolve.includes.concat(opts.resolve.examples).forEach(item => {
        const docsPath = _path().default.isAbsolute(item) ? item : _path().default.join(paths.cwd, item);
        if (_fs().default.existsSync(docsPath) && _fs().default.statSync(docsPath).isDirectory()) {
          childRoutes.push(...(0, _getRouteConfigFromDir.default)(docsPath, opts));
        }
      });
      debug('getRouteConfigFromDir');
    }
    // add main routes
    config.push({
      [DUMI_ROOT_FLAG]: true,
      // use to disable pro-layout in integrated mode
      layout: false,
      path: opts.isIntegrate ? (0, _integrate.prefix)('/') : '/',
      wrappers: [
      // theme layout
      (0, _slash().default)(_path().default.relative(api.paths.absPagesPath, theme.layoutPaths._))],
      // decorate standard umi routes
      routes: (0, _decorator.default)(yield api.applyPlugins({
        key: 'dumi.beforeDecorateRoutes',
        type: api.ApplyPluginsType.modify,
        initialValue: childRoutes
      }), opts, api),
      title: opts.title
    });
    debug('decorateRoutes');
    // process example routes
    config[0].routes.forEach(route => {
      var _route$meta;
      if ((_route$meta = route.meta) === null || _route$meta === void 0 ? void 0 : _route$meta.example) {
        const examplePath = route.path.replace('/', exampleRoutePrefix);
        // add example into top-level routes for external openning
        config.unshift({
          path: examplePath,
          component: route.component,
          title: opts.title ? `${route.meta.title} - ${opts.title}` : route.meta.title
        });
        // use example component as original example component
        route.component = theme.builtins.concat(theme.fallbacks).find(i => i.identifier === 'Example').modulePath;
        route.meta.examplePath = examplePath;
      }
    });
    debug('exampleRoutes');
    return config;
  });
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.default = _default;