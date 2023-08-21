"use strict";

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _server() {
  const data = require("@umijs/server");

  _server = function _server() {
    return data;
  };

  return data;
}

function _types() {
  const data = require("@umijs/types");

  _types = function _types() {
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

var _DevCompileDonePlugin = _interopRequireDefault(require("./DevCompileDonePlugin"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const args = (0, _utils().yParser)(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h']
  },
  boolean: ['version']
});
const command = args._[0];
const cwd = (0, _path().join)(process.cwd(), args.cwd || '');
const env = args.env || (command === 'dev' ? 'development' : 'production');
process.env.NODE_ENV = env;

if (args.version && !command) {
  args._[0] = 'version';
  const local = (0, _fs().existsSync)((0, _path().join)(__dirname, '../.local')) ? _utils().chalk.cyan('@local') : '';
  console.log(`bundler-webpack@${require('../package.json').version}${local}`);
  process.exit(0);
}

_asyncToGenerator(function* () {
  const configPath = (0, _path().join)(cwd, args.config || 'config.ts');
  const babelRegister = new (_utils().BabelRegister)();
  babelRegister.setOnlyMap({
    key: 'config',
    value: [configPath]
  });
  const config = (0, _fs().existsSync)(configPath) ? (0, _utils().compatESModuleRequire)(require(configPath)) : {};
  let entry = args.entry;

  if (entry) {
    entry = (0, _path().join)(cwd, entry);
  } else {
    var _files$;

    const files = [(0, _utils().getFile)({
      base: cwd,
      fileNameWithoutExt: 'src/index',
      type: 'javascript'
    }), (0, _utils().getFile)({
      base: cwd,
      fileNameWithoutExt: 'index',
      type: 'javascript'
    })].filter(Boolean);
    (0, _assert().default)(files.length, `Can't find the default entry.`);
    entry = (_files$ = files[0]) === null || _files$ === void 0 ? void 0 : _files$.path;
  }

  const bundler = new _index.Bundler({
    cwd,
    config
  }); // @ts-ignore

  const webpackConfig = yield bundler.getConfig({
    env,
    type: _types().BundlerConfigType.csr,
    hot: args.hot,
    entry: config.entry || {
      [(0, _path().basename)(entry, (0, _path().extname)(entry))]: entry
    }
  });

  if (command === 'build') {
    _utils().rimraf.sync((0, _path().join)(cwd, 'dist'));

    const _yield$bundler$build = yield bundler.build({
      bundleConfigs: [webpackConfig]
    }),
          stats = _yield$bundler$build.stats; // @ts-ignore


    console.log(stats.toString('normal'));
  } else if (command === 'dev') {
    const port = yield _utils().portfinder.getPortPromise({
      port: 8000
    }); // @ts-ignore

    webpackConfig.plugins.push(new _DevCompileDonePlugin.default({
      port
    }));
    const devServerOpts = bundler.setupDevServerOpts({
      bundleConfigs: [webpackConfig]
    });
    const server = new (_server().Server)(_objectSpread(_objectSpread({}, devServerOpts), {}, {
      compress: true,
      headers: {
        'access-control-allow-origin': '*'
      }
    }));
    yield server.listen({
      port,
      hostname: '127.0.0.1'
    });
  } else {
    throw new Error(`Unsupported command ${command}.`);
  }
})();