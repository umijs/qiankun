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

function _core() {
  const data = require("@umijs/core");

  _core = function _core() {
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

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const ROUTE_FILE_EXT_LIST = ['.js', '.jsx', '.tsx'];

function _default(api) {
  const cwd = api.cwd,
        Mustache = api.utils.Mustache;
  api.onGenerateFiles( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (args) {
      if ( // conventional routes
      !api.config.routes && // from watch
      args.files.length && // no files is valid route component
      !args.files.some(({
        path
      }) => {
        return path.startsWith(api.paths.absPagesPath) && ROUTE_FILE_EXT_LIST.includes((0, _path().extname)(path));
      })) {
        return;
      }

      api.logger.debug('generate core/routes.ts');
      const routesTpl = (0, _fs().readFileSync)((0, _path().join)(__dirname, 'routes.tpl'), 'utf-8');
      const routes = yield api.getRoutes();
      api.writeTmpFile({
        path: 'core/routes.ts',
        content: Mustache.render(routesTpl, {
          routes: new (_core().Route)().getJSON({
            routes,
            config: api.config,
            cwd
          }),
          runtimePath: _constants.runtimePath,
          config: api.config,
          loadingComponent: api.config.dynamicImport && api.config.dynamicImport.loading && (0, _utils().winPath)(api.config.dynamicImport.loading)
        })
      });
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()); // 这个加进去会导致 patchRoutes 在最初就执行，但期望的是在 render 后执行
  // 所以先不加
  // api.addUmiExports(() => {
  //   return {
  //     specifiers: ['routes'],
  //     source: `./routes`,
  //   };
  // });
}