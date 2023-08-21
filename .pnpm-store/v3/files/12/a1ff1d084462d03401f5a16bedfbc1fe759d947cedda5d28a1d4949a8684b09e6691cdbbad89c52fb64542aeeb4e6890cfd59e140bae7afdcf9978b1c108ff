"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConflictPaths = exports.matchMock = exports.normalizeConfig = exports.cleanRequireCache = exports.getMockConfig = exports.getMockData = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _bodyParser() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/body-parser"));

  _bodyParser = function _bodyParser() {
    return data;
  };

  return data;
}

function _multer() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/multer"));

  _multer = function _multer() {
    return data;
  };

  return data;
}

function _pathToRegexp() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/path-to-regexp"));

  _pathToRegexp = function _pathToRegexp() {
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

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
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

var _htmlUtils = require("../../../commands/htmlUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const VALID_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const BODY_PARSED_METHODS = ['post', 'put', 'patch', 'delete'];
const debug = (0, _utils().createDebug)('umi:preset-build-in:mock:utils');

/**
 * mock/*
 * .umirc.mock.js
 * .umirc.mock.ts
 * src/** or pages/**
 *
 * @param param
 */
const getMockData = ({
  cwd,
  ignore = [],
  registerBabel = () => {}
}) => {
  const mockPaths = [...(_utils().glob.sync('mock/**/*.[jt]s', {
    cwd,
    ignore
  }) || []), ...(_utils().glob.sync('**/_mock.[jt]s', {
    cwd,
    ignore
  }) || []), '.umirc.mock.js', '.umirc.mock.ts'].map(path => (0, _path().join)(cwd, path)).filter(path => path && (0, _fs().existsSync)(path)).map(path => (0, _utils().winPath)(path));
  debug(`load mock data including files ${JSON.stringify(mockPaths)}`); // register babel

  registerBabel(mockPaths); // get mock data

  const mockData = normalizeConfig(getMockConfig(mockPaths));
  const mockWatcherPaths = [...(mockPaths || []), (0, _path().join)(cwd, 'mock')].filter(path => path && (0, _fs().existsSync)(path)).map(path => (0, _utils().winPath)(path));
  return {
    mockData,
    mockPaths,
    mockWatcherPaths
  };
};

exports.getMockData = getMockData;

const getMockConfig = files => {
  return files.reduce((memo, mockFile) => {
    try {
      const m = require(mockFile); // eslint-disable-line


      memo = _objectSpread(_objectSpread({}, memo), m.default || m);
      return memo;
    } catch (e) {
      throw new Error(e.stack);
    }
  }, {});
};

exports.getMockConfig = getMockConfig;

const cleanRequireCache = paths => {
  Object.keys(require.cache).forEach(file => {
    if (paths.some(path => {
      return (0, _utils().winPath)(file).indexOf(path) > -1;
    })) {
      delete require.cache[file];
    }
  });
};

exports.cleanRequireCache = cleanRequireCache;

function parseKey(key) {
  let method = 'get';
  let path = key;

  if (/\s+/.test(key)) {
    const splited = key.split(/\s+/);
    method = splited[0].toLowerCase();
    path = splited[1]; // eslint-disable-line
  }

  (0, _assert().default)(VALID_METHODS.includes(method), `Invalid method ${method} for path ${path}, please check your mock files.`);
  return {
    method,
    path
  };
}

function createHandler(method, path, handler) {
  return function (req, res, next) {
    if (BODY_PARSED_METHODS.includes(method)) {
      _bodyParser().default.json({
        limit: '5mb',
        strict: false
      })(req, res, () => {
        _bodyParser().default.urlencoded({
          limit: '5mb',
          extended: true
        })(req, res, () => {
          sendData();
        });
      });
    } else {
      sendData();
    }

    function sendData() {
      if (typeof handler === 'function') {
        (0, _multer().default)().any()(req, res, () => {
          handler(req, res, next);
        });
      } else {
        res.json(handler);
      }
    }
  };
}

const normalizeConfig = config => {
  return Object.keys(config).reduce((memo, key) => {
    const handler = config[key];
    const type = typeof handler;
    (0, _assert().default)(type === 'function' || type === 'object', `mock value of ${key} should be function or object, but got ${type}`);

    const _parseKey = parseKey(key),
          method = _parseKey.method,
          path = _parseKey.path;

    const keys = [];
    const re = (0, _pathToRegexp().default)(path, keys);
    memo.push({
      method,
      path,
      re,
      keys,
      handler: createHandler(method, path, handler)
    });
    return memo;
  }, []);
};

exports.normalizeConfig = normalizeConfig;

function decodeParam(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param ' ${val} '`; // @ts-ignore

      err.status = 400; // @ts-ignore

      err.statusCode = 400;
    }

    throw err;
  }
}

const matchMock = (req, mockData) => {
  const targetPath = req.path,
        method = req.method;
  const targetMethod = method.toLowerCase();

  var _iterator = _createForOfIteratorHelper(mockData),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const mock = _step.value;
      const method = mock.method,
            re = mock.re,
            keys = mock.keys;

      if (method === targetMethod) {
        const match = re.exec(targetPath);

        if (match) {
          const params = {};

          for (let i = 1; i < match.length; i += 1) {
            const key = keys[i - 1];
            const prop = key.name;
            const val = decodeParam(match[i]); // @ts-ignore

            if (val !== undefined || !hasOwnProdperty.call(params, prop)) {
              params[prop] = val;
            }
          }

          req.params = params;
          return mock;
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return undefined;
};
/**
 * check if mock path conflict with router path
 * @param param0
 */


exports.matchMock = matchMock;

const getConflictPaths = ({
  mockData,
  routes
}) => {
  const conflictPaths = [];
  (0, _htmlUtils.getFlatRoutes)({
    routes
  }).forEach(route => {
    const path = route.path,
          redirect = route.redirect;

    if (path && !path.startsWith(':') && !redirect) {
      const req = {
        path: !path.startsWith('/') ? `/${path}` : path,
        method: 'get'
      };
      const matched = matchMock(req, mockData);

      if (matched) {
        conflictPaths.push({
          path: matched.path
        });
      }
    }
  });
  return conflictPaths;
};

exports.getConflictPaths = getConflictPaths;