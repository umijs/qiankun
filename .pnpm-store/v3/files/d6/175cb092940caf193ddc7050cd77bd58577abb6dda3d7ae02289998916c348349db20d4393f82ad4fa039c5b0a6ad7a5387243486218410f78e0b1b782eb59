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

var _createMiddleware2 = _interopRequireDefault(require("./createMiddleware"));

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(api) {
  var _userConfig$mock;

  const cwd = api.cwd,
        userConfig = api.userConfig;
  api.describe({
    key: 'mock',
    config: {
      schema(joi) {
        return joi.object().keys({
          exclude: joi.array().items(joi.string()).description('exclude files not parse mock')
        });
      }

    }
  });

  if (process.env.MOCK === 'none') {
    return;
  }

  const registerBabel = paths => {
    // support
    // clear require cache and set babel register
    const requireDeps = paths.reduce((memo, file) => {
      memo = memo.concat((0, _utils().parseRequireDeps)(file));
      return memo;
    }, []);
    requireDeps.forEach(f => {
      if (require.cache[f]) {
        delete require.cache[f];
      }
    });
    api.babelRegister.setOnlyMap({
      key: 'mock',
      value: [...paths, ...requireDeps]
    });
  };

  const ignore = [// ignore mock files under node_modules
  'node_modules/**', ...((userConfig === null || userConfig === void 0 ? void 0 : (_userConfig$mock = userConfig.mock) === null || _userConfig$mock === void 0 ? void 0 : _userConfig$mock.exclude) || [])];
  api.addBeforeMiddlewares( /*#__PURE__*/_asyncToGenerator(function* () {
    const checkConflictPaths = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(function* (mockRes) {
        const routes = yield api.getRoutes();
        const conflictPaths = (0, _utils2.getConflictPaths)({
          routes,
          mockData: mockRes.mockData
        });

        if ((conflictPaths === null || conflictPaths === void 0 ? void 0 : conflictPaths.length) > 0) {
          // [WARN] for conflict path with routes config
          api.logger.warn('mock paths', conflictPaths.map(conflictPath => conflictPath.path), 'conflicts with route config.');
        }
      });

      return function checkConflictPaths(_x) {
        return _ref2.apply(this, arguments);
      };
    }();

    const mockResult = (0, _utils2.getMockData)({
      cwd,
      ignore,
      registerBabel
    }); // check whether conflict when starting

    yield checkConflictPaths(mockResult);

    const _createMiddleware = (0, _createMiddleware2.default)(_objectSpread(_objectSpread({}, mockResult), {}, {
      updateMockData: function () {
        var _updateMockData = _asyncToGenerator(function* () {
          const result = (0, _utils2.getMockData)({
            cwd,
            ignore,
            registerBabel
          }); // check whether conflict when updating

          // check whether conflict when updating
          yield checkConflictPaths(result);
          return result;
        });

        function updateMockData() {
          return _updateMockData.apply(this, arguments);
        }

        return updateMockData;
      }()
    })),
          middleware = _createMiddleware.middleware;

    return middleware;
  }));
}