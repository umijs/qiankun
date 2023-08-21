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

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const debug = (0, _utils().createDebug)('umi:preset-build-in:mock:createMiddleware');

function _default(opts = {}) {
  const mockData = opts.mockData,
        mockWatcherPaths = opts.mockWatcherPaths,
        updateMockData = opts.updateMockData;
  let data = mockData; // watcher

  const errors = [];
  debug('mockWatcherPaths', mockWatcherPaths);

  const watcher = _utils().chokidar.watch(mockWatcherPaths, {
    ignoreInitial: true
  });

  watcher.on('ready', () => debug('Initial scan complete. Ready for changes')).on('all', // debounce avoiding too much file change events
  _utils().lodash.debounce( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (event, file) {
      var _yield$updateMockData;

      debug(`[${event}] ${file}, reload mock data`);
      errors.splice(0, errors.length);
      (0, _utils2.cleanRequireCache)(mockWatcherPaths); // refresh data

      data = (_yield$updateMockData = yield updateMockData()) === null || _yield$updateMockData === void 0 ? void 0 : _yield$updateMockData.mockData;

      if (!errors.length) {
        _utils().signale.success(`Mock files parse success`);
      }
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }(), 300)); // close

  process.once('SIGINT', /*#__PURE__*/_asyncToGenerator(function* () {
    yield watcher.close();
  }));
  return {
    middleware: (req, res, next) => {
      const match = data && (0, _utils2.matchMock)(req, data);

      if (match) {
        debug(`mock matched: [${match.method}] ${match.path}`);
        return match.handler(req, res, next);
      } else {
        return next();
      }
    },
    watcher
  };
}