"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

function _compression() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/compression"));

  _compression = function _compression() {
    return data;
  };

  return data;
}

function _express() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/express"));

  _express = function _express() {
    return data;
  };

  return data;
}

function _httpProxyMiddleware() {
  const data = require("@umijs/deps/compiled/http-proxy-middleware");

  _httpProxyMiddleware = function _httpProxyMiddleware() {
    return data;
  };

  return data;
}

function _sockjs() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/sockjs"));

  _sockjs = function _sockjs() {
    return data;
  };

  return data;
}

function _spdy() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/spdy"));

  _spdy = function _spdy() {
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

function http() {
  const data = _interopRequireWildcard(require("http"));

  http = function http() {
    return data;
  };

  return data;
}

function https() {
  const data = _interopRequireWildcard(require("https"));

  https = function https() {
    return data;
  };

  return data;
}

function url() {
  const data = _interopRequireWildcard(require("url"));

  url = function url() {
    return data;
  };

  return data;
}

var _utils2 = require("./utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const logger = new (_core().Logger)('@umijs/server');
const debug = (0, _utils().createDebug)('umi:server:Server');
const defaultOpts = {
  afterMiddlewares: [],
  beforeMiddlewares: [],
  compilerMiddleware: null,
  compress: true,
  // enable by default if add HTTP2
  https: !!process.env.HTTP2 ? true : !!process.env.HTTPS,
  onListening: argv => argv,
  onConnection: () => {},
  onConnectionClose: () => {},
  proxy: null,
  headers: {},
  // not use
  host: 'localhost',
  port: 8000,
  writeToDisk: false
};

class Server {
  // @ts-ignore
  // @ts-ignore
  // Proxy sockets
  constructor(opts) {
    this.app = void 0;
    this.opts = void 0;
    this.socketServer = void 0;
    this.listeningApp = void 0;
    this.listeninspdygApp = void 0;
    this.sockets = [];
    this.socketProxies = [];
    this.opts = _objectSpread(_objectSpread({}, defaultOpts), _utils().lodash.omitBy(opts, _utils().lodash.isUndefined));
    this.app = (0, _express().default)();
    this.setupFeatures();
    this.createServer();
    this.socketProxies.forEach(wsProxy => {
      // subscribe to http 'upgrade'
      // @ts-ignore
      this.listeningApp.on('upgrade', wsProxy.upgrade);
    }, this);
  }

  getHttpsOptions() {
    if (this.opts.https) {
      const credential = (0, _utils2.getCredentials)(this.opts); // note that options.spdy never existed. The user was able
      // to set options.https.spdy before, though it was not in the
      // docs. Keep options.https.spdy if the user sets it for
      // backwards compatibility, but log a deprecation warning.

      if (typeof this.opts.https === 'object' && this.opts.https.spdy) {
        // for backwards compatibility: if options.https.spdy was passed in before,
        // it was not altered in any way
        logger.warn('Providing custom spdy server options is deprecated and will be removed in the next major version.');
        return credential;
      } else {
        var _this$opts$https;

        // If user config forces using http2, we should configure spdy
        if (process.env.HTTP2) {
          return _objectSpread(_objectSpread({}, credential), {}, {
            spdy: {
              protocols: ['h2', 'http/1.1']
            }
          });
        } // If user config explicitly sets http2 to false, we should not configure spdy


        if (typeof this.opts.https === 'object' && ((_this$opts$https = this.opts.https) === null || _this$opts$https === void 0 ? void 0 : _this$opts$https.http2) === false) {
          return _objectSpread(_objectSpread({}, credential), {}, {
            spdy: undefined
          });
        } // Default to use spdy(google's http2 implementation) when https is enabled


        return _objectSpread(_objectSpread({}, credential), {}, {
          spdy: {
            protocols: ['h2', 'http/1.1']
          }
        });
      }
    }

    return;
  }

  setupFeatures() {
    const features = {
      compress: () => {
        if (this.opts.compress) {
          this.setupCompress();
        }
      },
      headers: () => {
        if (_utils().lodash.isPlainObject(this.opts.headers)) {
          this.setupHeaders();
        }
      },
      beforeMiddlewares: () => {
        this.opts.beforeMiddlewares.forEach(middleware => {
          // @ts-ignore
          this.app.use(middleware);
        });
      },
      proxy: () => {
        if (this.opts.proxy) {
          this.setupProxy();
        }
      },
      compilerMiddleware: () => {
        if (this.opts.compilerMiddleware) {
          // @ts-ignore
          this.app.use(this.opts.compilerMiddleware);
        }
      },
      afterMiddlewares: () => {
        this.opts.afterMiddlewares.forEach(middleware => {
          // @ts-ignore
          this.app.use(middleware);
        });
      }
    };
    Object.keys(features).forEach(stage => {
      features[stage]();
    });
  }
  /**
   * response headers
   */


  setupHeaders() {
    this.app.all('*', (req, res, next) => {
      // eslint-disable-next-line
      res.set(this.opts.headers);
      next();
    });
  }
  /**
   * dev server compress to gzip assets
   */


  setupCompress() {
    const compressOpts = _utils().lodash.isBoolean(this.opts.compress) ? {} : this.opts.compress;
    this.app.use((0, _compression().default)(compressOpts));
  }

  deleteRoutes() {
    let startIndex = null;
    let endIndex = null;

    this.app._router.stack.forEach((item, index) => {
      if (item.name === 'PROXY_START') startIndex = index;
      if (item.name === 'PROXY_END') endIndex = index;
    });

    debug(`routes before changed: ${this.app._router.stack.map(item => item.name || 'undefined name').join(', ')}`);

    if (startIndex !== null && endIndex !== null) {
      this.app._router.stack.splice(startIndex, endIndex - startIndex + 1);
    }

    debug(`routes after changed: ${this.app._router.stack.map(item => item.name || 'undefined name').join(', ')}`);
  }
  /**
   * proxy middleware for dev
   * not coupled with build tools (like webpack, rollup, ...)
   */


  setupProxy(proxyOpts, isWatch = false) {
    let proxy = proxyOpts || this.opts.proxy;

    if (!Array.isArray(proxy)) {
      if (proxy && 'target' in proxy) {
        proxy = [proxy];
      } else {
        proxy = Object.keys(proxy || {}).map(context => {
          var _proxy;

          let proxyOptions; // For backwards compatibility reasons.

          const correctedContext = context.replace(/^\*$/, '**').replace(/\/\*$/, '');

          if (typeof ((_proxy = proxy) === null || _proxy === void 0 ? void 0 : _proxy[context]) === 'string') {
            proxyOptions = {
              context: correctedContext,
              target: proxy[context]
            };
          } else {
            var _proxy2;

            proxyOptions = _objectSpread(_objectSpread({}, ((_proxy2 = proxy) === null || _proxy2 === void 0 ? void 0 : _proxy2[context]) || {}), {}, {
              context: correctedContext
            });
          }

          proxyOptions.logLevel = proxyOptions.logLevel || 'warn';
          return proxyOptions;
        });
      }
    }

    const getProxyMiddleware = proxyConfig => {
      const context = proxyConfig.context || proxyConfig.path; // It is possible to use the `bypass` method without a `target`.
      // However, the proxy middleware has no use in this case, and will fail to instantiate.

      if (proxyConfig.target) {
        const target = typeof proxyConfig.target === 'object' ? url().format(proxyConfig.target) : proxyConfig.target;
        return (0, _httpProxyMiddleware().createProxyMiddleware)(context, _objectSpread(_objectSpread({}, proxyConfig), {}, {
          onProxyReq(proxyReq, req, res) {
            var _proxyConfig$onProxyR;

            (_proxyConfig$onProxyR = proxyConfig.onProxyReq) === null || _proxyConfig$onProxyR === void 0 ? void 0 : _proxyConfig$onProxyR.call(proxyConfig, proxyReq, req, res);
          },

          onProxyRes(proxyRes, req, res) {
            var _URL, _proxyConfig$onProxyR2;

            const realUrl = ((_URL = new URL(req.url || '', target)) === null || _URL === void 0 ? void 0 : _URL.href) || '';
            proxyRes.headers['x-real-url'] = realUrl;
            (_proxyConfig$onProxyR2 = proxyConfig.onProxyRes) === null || _proxyConfig$onProxyR2 === void 0 ? void 0 : _proxyConfig$onProxyR2.call(proxyConfig, proxyRes, req, res);
          }

        }));
      }

      return;
    }; // refresh proxy config


    let startIndex = null;
    let endIndex = null;
    let routesLength = null; // when proxy opts change, delete before proxy middlwares

    if (isWatch) {
      this.app._router.stack.forEach((item, index) => {
        if (item.name === 'PROXY_START') startIndex = index;
        if (item.name === 'PROXY_END') endIndex = index;
      });

      if (startIndex !== null && endIndex !== null) {
        this.app._router.stack.splice(startIndex, endIndex - startIndex + 1);
      }

      routesLength = this.app._router.stack.length;
      this.deleteRoutes();
    } // log proxy middleware before


    this.app.use(function PROXY_START(req, res, next) {
      next();
    });
    proxy.forEach(proxyConfigOrCallback => {
      let proxyMiddleware;
      let proxyConfig = typeof proxyConfigOrCallback === 'function' ? proxyConfigOrCallback() : proxyConfigOrCallback;
      proxyMiddleware = getProxyMiddleware(proxyConfig);

      if (proxyConfig.ws && proxyMiddleware) {
        this.socketProxies.push(proxyMiddleware);
      }

      this.app.use((req, res, next) => {
        if (typeof proxyConfigOrCallback === 'function') {
          const newProxyConfig = proxyConfigOrCallback();

          if (newProxyConfig !== proxyConfig) {
            proxyConfig = newProxyConfig;
            proxyMiddleware = getProxyMiddleware(proxyConfig);
          }
        } // - Check if we have a bypass function defined
        // - In case the bypass function is defined we'll retrieve the
        // bypassUrl from it otherwise bypassUrl would be null


        const bypassUrl = _utils().lodash.isFunction(proxyConfig.bypass) ? proxyConfig.bypass(req, res, proxyConfig) : null;

        if (typeof bypassUrl === 'boolean') {
          // skip the proxy
          // @ts-ignore
          req.url = null;
          next();
        } else if (typeof bypassUrl === 'string') {
          // byPass to that url
          req.url = bypassUrl;
          next();
        } else if (proxyMiddleware) {
          return proxyMiddleware(req, res, next);
        } else {
          next();
        }
      });
    });
    this.app.use(function PROXY_END(req, res, next) {
      next();
    }); // log proxy middleware after

    if (isWatch) {
      const newRoutes = this.app._router.stack.splice(routesLength, this.app._router.stack.length - routesLength);

      this.app._router.stack.splice(startIndex, 0, ...newRoutes);
    }
  }

  sockWrite({
    sockets = this.sockets,
    type,
    data
  }) {
    sockets.forEach(socket => {
      socket.write(JSON.stringify({
        type,
        data
      }));
    });
  }

  createServer() {
    const httpsOpts = this.getHttpsOptions();

    if (httpsOpts) {
      // If spdy is configured, use spdy server
      if (httpsOpts.spdy) {
        this.listeningApp = _spdy().default.createServer(httpsOpts, this.app); // Otherwise fallback to plain https server
      } else {
        this.listeningApp = https().createServer(httpsOpts, this.app);
      }
    } else {
      this.listeningApp = http().createServer(this.app);
    }
  }

  listen({
    port = 8000,
    hostname
  }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const foundPort = yield _utils().portfinder.getPortPromise({
        port
      });
      return new Promise(resolve => {
        _this.listeningApp.listen(foundPort, hostname, () => {
          _this.createSocketServer();

          const ret = {
            port: foundPort,
            hostname,
            listeningApp: _this.listeningApp,
            server: _this
          };

          _this.opts.onListening(ret);

          resolve(ret);
        });
      });
    })();
  }

  createSocketServer() {
    const server = _sockjs().default.createServer({
      log: (severity, line) => {
        if (line.includes('bound to')) return; // console.log(`${chalk.gray('[sockjs]')} ${line}`);
      }
    });

    server.installHandlers(this.listeningApp, {
      prefix: '/dev-server'
    });
    server.on('connection', connection => {
      // Windows connection might be undefined
      // https://github.com/webpack/webpack-dev-server/issues/2199
      // https://github.com/sockjs/sockjs-node/issues/121
      // https://github.com/meteor/meteor/pull/10891/files
      if (!connection) {
        return;
      }

      this.opts.onConnection({
        connection,
        server: this
      });
      this.sockets.push(connection);
      connection.on('close', () => {
        this.opts.onConnectionClose({
          connection
        });
        const index = this.sockets.indexOf(connection);

        if (index >= 0) {
          this.sockets.splice(index, 1);
        }
      });
    });
    this.socketServer = server;
  }

}

var _default = Server;
exports.default = _default;