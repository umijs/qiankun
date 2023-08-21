export { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history-with-query';
export { __RouterContext } from 'react-router';
export { Link, MemoryRouter, NavLink, Prompt, Redirect, Route, Router, StaticRouter, Switch, matchPath, useHistory, useLocation, useParams, useRouteMatch, withRouter } from 'react-router-dom';
import { createContext, forwardRef, createElement, useContext, useImperativeHandle } from 'react';
import { useSubscription } from 'use-subscription';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var LoadableContext = /*#__PURE__*/createContext(null);

var ALL_INITIALIZERS = [];
var READY_INITIALIZERS = [];
var initialized = false;

function load(loader) {
  var promise = loader();
  var state = {
    loading: true,
    loaded: null,
    error: null
  };
  state.promise = promise.then(function (loaded) {
    state.loading = false;
    state.loaded = loaded;
    return loaded;
  }).catch(function (err) {
    state.loading = false;
    state.error = err;
    throw err;
  });
  return state;
}

function loadMap(obj) {
  var state = {
    loading: false,
    loaded: {},
    error: null
  };
  var promises = [];

  try {
    Object.keys(obj).forEach(function (key) {
      var result = load(obj[key]);

      if (!result.loading) {
        state.loaded[key] = result.loaded;
        state.error = result.error;
      } else {
        state.loading = true;
      }

      promises.push(result.promise);
      result.promise.then(function (res) {
        state.loaded[key] = res;
      }).catch(function (err) {
        state.error = err;
      });
    });
  } catch (err) {
    state.error = err;
  }

  state.promise = Promise.all(promises).then(function (res) {
    state.loading = false;
    return res;
  }).catch(function (err) {
    state.loading = false;
    throw err;
  });
  return state;
}

function resolve(obj) {
  return obj && obj.__esModule ? obj.default : obj;
}

function render(loaded, props) {
  return /*#__PURE__*/createElement(resolve(loaded), props);
}

function createLoadableComponent(loadFn, options) {
  var opts = Object.assign({
    loader: null,
    loading: null,
    delay: 200,
    timeout: null,
    render: render,
    webpack: null,
    modules: null
  }, options);
  var subscription = null;

  function init() {
    if (!subscription) {
      var sub = new LoadableSubscription(loadFn, opts);
      subscription = {
        getCurrentValue: sub.getCurrentValue.bind(sub),
        subscribe: sub.subscribe.bind(sub),
        retry: sub.retry.bind(sub),
        promise: sub.promise.bind(sub)
      };
    }

    return subscription.promise();
  } // Server only


  if (typeof window === 'undefined') {
    ALL_INITIALIZERS.push(init);
  } // Client only


  if (!initialized && typeof window !== 'undefined' && typeof opts.webpack === 'function') {
    var moduleIds = opts.webpack();
    READY_INITIALIZERS.push(function (ids) {
      var _iterator = _createForOfIteratorHelper(moduleIds),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var moduleId = _step.value;

          if (ids.indexOf(moduleId) !== -1) {
            return init();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
  }

  var LoadableComponent = function LoadableComponent(props, ref) {
    init();
    var context = useContext(LoadableContext);
    var state = useSubscription(subscription);
    useImperativeHandle(ref, function () {
      return {
        retry: subscription.retry
      };
    });

    if (context && Array.isArray(opts.modules)) {
      opts.modules.forEach(function (moduleName) {
        context(moduleName);
      });
    }

    if (state.loading || state.error) {
      if (process.env.NODE_ENV === 'development' && state.error) {
        console.error("[@umijs/runtime] load component failed", state.error);
      }

      return /*#__PURE__*/createElement(opts.loading, {
        isLoading: state.loading,
        pastDelay: state.pastDelay,
        timedOut: state.timedOut,
        error: state.error,
        retry: subscription.retry
      });
    } else if (state.loaded) {
      return opts.render(state.loaded, props);
    } else {
      return null;
    }
  };

  var LoadableComponentWithRef = /*#__PURE__*/forwardRef(LoadableComponent); // add static method in React.forwardRef
  // https://github.com/facebook/react/issues/17830

  LoadableComponentWithRef.preload = function () {
    return init();
  };

  LoadableComponentWithRef.displayName = 'LoadableComponent';
  return LoadableComponentWithRef;
}

var LoadableSubscription = /*#__PURE__*/function () {
  function LoadableSubscription(loadFn, opts) {
    _classCallCheck(this, LoadableSubscription);

    this._loadFn = loadFn;
    this._opts = opts;
    this._callbacks = new Set();
    this._delay = null;
    this._timeout = null;
    this.retry();
  }

  _createClass(LoadableSubscription, [{
    key: "promise",
    value: function promise() {
      return this._res.promise;
    }
  }, {
    key: "retry",
    value: function retry() {
      var _this = this;

      this._clearTimeouts();

      this._res = this._loadFn(this._opts.loader);
      this._state = {
        pastDelay: false,
        timedOut: false
      };
      var res = this._res,
          opts = this._opts;

      if (res.loading) {
        if (typeof opts.delay === 'number') {
          if (opts.delay === 0) {
            this._state.pastDelay = true;
          } else {
            this._delay = setTimeout(function () {
              _this._update({
                pastDelay: true
              });
            }, opts.delay);
          }
        }

        if (typeof opts.timeout === 'number') {
          this._timeout = setTimeout(function () {
            _this._update({
              timedOut: true
            });
          }, opts.timeout);
        }
      }

      this._res.promise.then(function () {
        _this._update();

        _this._clearTimeouts();
      }) // eslint-disable-next-line handle-callback-err
      .catch(function (err) {
        _this._update();

        _this._clearTimeouts();
      });

      this._update({});
    }
  }, {
    key: "_update",
    value: function _update(partial) {
      this._state = _objectSpread2(_objectSpread2({}, this._state), partial);

      this._callbacks.forEach(function (callback) {
        return callback();
      });
    }
  }, {
    key: "_clearTimeouts",
    value: function _clearTimeouts() {
      clearTimeout(this._delay);
      clearTimeout(this._timeout);
    }
  }, {
    key: "getCurrentValue",
    value: function getCurrentValue() {
      return _objectSpread2(_objectSpread2({}, this._state), {}, {
        error: this._res.error,
        loaded: this._res.loaded,
        loading: this._res.loading
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(callback) {
      var _this2 = this;

      this._callbacks.add(callback);

      return function () {
        _this2._callbacks.delete(callback);
      };
    }
  }]);

  return LoadableSubscription;
}();

function Loadable(opts) {
  return createLoadableComponent(load, opts);
}

function LoadableMap(opts) {
  if (typeof opts.render !== 'function') {
    throw new Error('LoadableMap requires a `render(loaded, props)` function');
  }

  return createLoadableComponent(loadMap, opts);
}

Loadable.Map = LoadableMap;

function flushInitializers(initializers, ids) {
  var promises = [];

  while (initializers.length) {
    var init = initializers.pop();
    promises.push(init(ids));
  }

  return Promise.all(promises).then(function () {
    if (initializers.length) {
      return flushInitializers(initializers, ids);
    }
  });
}

Loadable.preloadAll = function () {
  return new Promise(function (resolve, reject) {
    flushInitializers(ALL_INITIALIZERS).then(resolve, reject);
  });
};

Loadable.preloadReady = function () {
  var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return new Promise(function (resolve) {
    var res = function res() {
      initialized = true;
      return resolve();
    }; // We always will resolve, errors should be handled within loading UIs.


    flushInitializers(READY_INITIALIZERS, ids).then(res, res);
  });
};

if (typeof window !== 'undefined') {
  window.__NEXT_PRELOADREADY = Loadable.preloadReady;
}

function dynamic (opts) {
  var loadableFn = Loadable;
  var loadableOptions = {
    loading: function loading(_ref) {
      var error = _ref.error,
          isLoading = _ref.isLoading;

      if (process.env.NODE_ENV === 'development') {
        if (isLoading) {
          return /*#__PURE__*/createElement("p", null, "loading...");
        }

        if (error) {
          return /*#__PURE__*/createElement("p", null, error.message, /*#__PURE__*/createElement("br", null), error.stack);
        }
      }

      return /*#__PURE__*/createElement("p", null, "loading...");
    }
  }; // Support for direct import(),
  // eg: dynamic(() => import('../hello-world'))

  if (typeof opts === 'function') {
    loadableOptions.loader = opts; // Support for having first argument being options,
    // eg: dynamic({loader: import('../hello-world')})
  } else if (_typeof(opts) === 'object') {
    loadableOptions = _objectSpread2(_objectSpread2({}, loadableOptions), opts);
  } else {
    throw new Error("Unexpect arguments ".concat(opts));
  } // Support for passing options,
  // eg: dynamic(import('../hello-world'), {loading: () => <p>Loading something</p>})
  // loadableOptions = { ...loadableOptions, ...options };


  return loadableFn(loadableOptions);
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

/**
 * whether in browser env
 */

var isBrowser = function isBrowser() {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined';
};

var ApplyPluginsType;

(function (ApplyPluginsType) {
  ApplyPluginsType["compose"] = "compose";
  ApplyPluginsType["modify"] = "modify";
  ApplyPluginsType["event"] = "event";
})(ApplyPluginsType || (ApplyPluginsType = {}));

function _compose(_ref) {
  var fns = _ref.fns,
      args = _ref.args;

  if (fns.length === 1) {
    return fns[0];
  }

  var last = fns.pop();
  return fns.reduce(function (a, b) {
    return function () {
      return b(a, args);
    };
  }, last);
}

function isPromiseLike(obj) {
  return !!obj && _typeof(obj) === 'object' && typeof obj.then === 'function';
}

var Plugin = /*#__PURE__*/function () {
  function Plugin(opts) {
    _classCallCheck(this, Plugin);

    this.validKeys = void 0;
    this.hooks = {};
    this.validKeys = (opts === null || opts === void 0 ? void 0 : opts.validKeys) || [];
  }

  _createClass(Plugin, [{
    key: "register",
    value: function register(plugin) {
      var _this = this;

      assert(!!plugin.apply, "register failed, plugin.apply must supplied");
      assert(!!plugin.path, "register failed, plugin.path must supplied");
      Object.keys(plugin.apply).forEach(function (key) {
        assert(_this.validKeys.indexOf(key) > -1, "register failed, invalid key ".concat(key, " from plugin ").concat(plugin.path, "."));
        if (!_this.hooks[key]) _this.hooks[key] = [];
        _this.hooks[key] = _this.hooks[key].concat(plugin.apply[key]);
      });
    }
  }, {
    key: "getHooks",
    value: function getHooks(keyWithDot) {
      var _keyWithDot$split = keyWithDot.split('.'),
          _keyWithDot$split2 = _toArray(_keyWithDot$split),
          key = _keyWithDot$split2[0],
          memberKeys = _keyWithDot$split2.slice(1);

      var hooks = this.hooks[key] || [];

      if (memberKeys.length) {
        hooks = hooks.map(function (hook) {
          try {
            var ret = hook;

            var _iterator = _createForOfIteratorHelper(memberKeys),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var memberKey = _step.value;
                ret = ret[memberKey];
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            return ret;
          } catch (e) {
            return null;
          }
        }).filter(Boolean);
      }

      return hooks;
    }
  }, {
    key: "applyPlugins",
    value: function applyPlugins(_ref2) {
      var key = _ref2.key,
          type = _ref2.type,
          initialValue = _ref2.initialValue,
          args = _ref2.args,
          async = _ref2.async;
      var hooks = this.getHooks(key) || [];

      if (args) {
        assert(_typeof(args) === 'object', "applyPlugins failed, args must be plain object.");
      }

      switch (type) {
        case ApplyPluginsType.modify:
          if (async) {
            return hooks.reduce( /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(memo, hook) {
                var ret;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        assert(typeof hook === 'function' || _typeof(hook) === 'object' || isPromiseLike(hook), "applyPlugins failed, all hooks for key ".concat(key, " must be function, plain object or Promise."));

                        if (!isPromiseLike(memo)) {
                          _context.next = 5;
                          break;
                        }

                        _context.next = 4;
                        return memo;

                      case 4:
                        memo = _context.sent;

                      case 5:
                        if (!(typeof hook === 'function')) {
                          _context.next = 16;
                          break;
                        }

                        ret = hook(memo, args);

                        if (!isPromiseLike(ret)) {
                          _context.next = 13;
                          break;
                        }

                        _context.next = 10;
                        return ret;

                      case 10:
                        return _context.abrupt("return", _context.sent);

                      case 13:
                        return _context.abrupt("return", ret);

                      case 14:
                        _context.next = 21;
                        break;

                      case 16:
                        if (!isPromiseLike(hook)) {
                          _context.next = 20;
                          break;
                        }

                        _context.next = 19;
                        return hook;

                      case 19:
                        hook = _context.sent;

                      case 20:
                        return _context.abrupt("return", _objectSpread2(_objectSpread2({}, memo), hook));

                      case 21:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x, _x2) {
                return _ref3.apply(this, arguments);
              };
            }(), isPromiseLike(initialValue) ? initialValue : Promise.resolve(initialValue));
          } else {
            return hooks.reduce(function (memo, hook) {
              assert(typeof hook === 'function' || _typeof(hook) === 'object', "applyPlugins failed, all hooks for key ".concat(key, " must be function or plain object."));

              if (typeof hook === 'function') {
                return hook(memo, args);
              } else {
                // TODO: deepmerge?
                return _objectSpread2(_objectSpread2({}, memo), hook);
              }
            }, initialValue);
          }

        case ApplyPluginsType.event:
          return hooks.forEach(function (hook) {
            assert(typeof hook === 'function', "applyPlugins failed, all hooks for key ".concat(key, " must be function."));
            hook(args);
          });

        case ApplyPluginsType.compose:
          return function () {
            return _compose({
              fns: hooks.concat(initialValue),
              args: args
            })();
          };
      }
    }
  }]);

  return Plugin;
}();

export { ApplyPluginsType, Plugin, dynamic, isBrowser };
