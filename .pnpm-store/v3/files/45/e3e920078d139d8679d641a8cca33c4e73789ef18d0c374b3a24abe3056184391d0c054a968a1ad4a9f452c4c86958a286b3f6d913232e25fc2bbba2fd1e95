"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCredentials = void 0;

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

function _immer() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/immer"));

  _immer = function _immer() {
    return data;
  };

  return data;
}

function fs() {
  const data = _interopRequireWildcard(require("fs"));

  fs = function fs() {
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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const logger = new (_core().Logger)('@umijs/server:utils');

function useDefaultKeyCertOptions(httpsOptions) {
  const defaultKeyCertOptions = {
    key: (0, _path().join)(__dirname, 'cert', 'key.pem'),
    cert: (0, _path().join)(__dirname, 'cert', 'cert.pem')
  };

  if (httpsOptions === true) {
    return defaultKeyCertOptions;
  }

  if (typeof httpsOptions === 'object') {
    return _objectSpread(_objectSpread({}, defaultKeyCertOptions), httpsOptions);
  }

  return {};
}

const getCredentials = opts => {
  const https = opts.https;
  const serverOptions = useDefaultKeyCertOptions(https);

  if (!(serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.key) || !(serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.cert)) {
    const err = new Error(`Both options.https.key and options.https.cert are required.`);
    logger.error(err);
    throw err;
  }

  const credentials = (0, _immer().default)(_objectSpread(_objectSpread({}, serverOptions), {}, {
    key: fs().readFileSync(serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.key, 'utf-8'),
    cert: fs().readFileSync(serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.cert, 'utf-8')
  }), draft => {
    if (typeof serverOptions === 'object' && serverOptions.ca) {
      const newServerOptions = (0, _immer().default)(serverOptions, optDraft => {
        // @ts-ignore
        optDraft.ca = !Array.isArray(optDraft.ca) ? [optDraft.ca] : optDraft.ca;
      });

      if (Array.isArray(newServerOptions.ca)) {
        // @ts-ignore
        draft.ca = newServerOptions.ca.map(function (ca) {
          return fs().readFileSync(ca, 'utf-8');
        });
      }
    }
  });
  return credentials;
};

exports.getCredentials = getCredentials;