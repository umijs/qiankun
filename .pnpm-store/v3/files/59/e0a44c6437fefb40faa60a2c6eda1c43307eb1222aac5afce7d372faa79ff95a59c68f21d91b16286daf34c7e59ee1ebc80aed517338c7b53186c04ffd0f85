import { __RouterContext, matchPath, Redirect, ApplyPluginsType, Router } from '@umijs/runtime';
import React, { Children, isValidElement, cloneElement, useState, useEffect, createElement } from 'react';
import ReactDOM from 'react-dom/client';
import { matchRoutes } from 'react-router-config';

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

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
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

function Route(props) {
  return /*#__PURE__*/React.createElement(__RouterContext.Consumer, null, function (context) {
    var location = props.location || context.location;
    var match = props.computedMatch;

    var newProps = _objectSpread2(_objectSpread2({}, context), {}, {
      location: location,
      match: match
    });

    var render = props.render;
    return /*#__PURE__*/React.createElement(__RouterContext.Provider, {
      value: newProps
    }, newProps.match ? render(_objectSpread2(_objectSpread2({}, props.layoutProps), newProps)) : null);
  });
}

var _excluded = ["children"];
function Switch(props) {
  return /*#__PURE__*/React.createElement(__RouterContext.Consumer, null, function (context) {
    var children = props.children,
        extraProps = _objectWithoutProperties(props, _excluded);

    var location = props.location || context.location;
    var element,
        match = null;
    Children.forEach(children, function (child) {
      if (match === null && /*#__PURE__*/isValidElement(child)) {
        element = child;
        var path = child.props.path || child.props.from;
        match = path ? matchPath(location.pathname, _objectSpread2(_objectSpread2({}, child.props), {}, {
          path: path
        })) : context.match;
      }
    });
    return match ? /*#__PURE__*/cloneElement(element, {
      location: location,
      computedMatch: match,
      layoutProps: extraProps
    }) : null;
  });
}

var _excluded$1 = ["component"];

function wrapInitialPropsFetch(route, opts) {
  var component = route.component,
      restRouteParams = _objectWithoutProperties(route, _excluded$1);

  var Component = route.component;

  function ComponentWithInitialPropsFetch(props) {
    var _useState = useState(function () {
      return window.g_initialProps;
    }),
        _useState2 = _slicedToArray(_useState, 2),
        initialProps = _useState2[0],
        setInitialProps = _useState2[1];

    useEffect(function () {
      /**
       * 1. 首次渲染时，此时 window.g_initialProps 变量存在，不需要再走一次 getInitialProps，这样一次 SSR 就走了 2 次 getInitialProps
       * 2. 但是路由切换时，window.getInitialProps 会被赋为 null，这时候就走 getInitialProps 逻辑
       * 3. 如果任何时候都走 2 次，配置 forceInitial: true，这个场景用于静态站点的首屏加载希望走最新数据
       * 4. 开启动态加载后，会在执行 getInitialProps 前预加载下
       */
      var handleGetInitialProps = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var _preloadComponent;

          var preloadComponent, defaultCtx, ctx, _initialProps;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // preload when enalbe dynamicImport
                  preloadComponent = Component;

                  if (!Component.preload) {
                    _context.next = 6;
                    break;
                  }

                  _context.next = 4;
                  return Component.preload();

                case 4:
                  preloadComponent = _context.sent;
                  // for test case, really use .default
                  preloadComponent = preloadComponent.default || preloadComponent;

                case 6:
                  defaultCtx = _objectSpread2(_objectSpread2({
                    isServer: false,
                    match: props === null || props === void 0 ? void 0 : props.match,
                    history: props === null || props === void 0 ? void 0 : props.history,
                    route: route
                  }, opts.getInitialPropsCtx || {}), restRouteParams);

                  if (!((_preloadComponent = preloadComponent) === null || _preloadComponent === void 0 ? void 0 : _preloadComponent.getInitialProps)) {
                    _context.next = 15;
                    break;
                  }

                  _context.next = 10;
                  return opts.plugin.applyPlugins({
                    key: 'ssr.modifyGetInitialPropsCtx',
                    type: ApplyPluginsType.modify,
                    initialValue: defaultCtx,
                    async: true
                  });

                case 10:
                  ctx = _context.sent;
                  _context.next = 13;
                  return preloadComponent.getInitialProps(ctx || defaultCtx);

                case 13:
                  _initialProps = _context.sent;
                  setInitialProps(_initialProps);

                case 15:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function handleGetInitialProps() {
          return _ref.apply(this, arguments);
        };
      }(); // null 时，一定会触发 getInitialProps 执行


      if (!window.g_initialProps) {
        handleGetInitialProps();
      }
    }, [window.location.pathname, window.location.search]);
    return /*#__PURE__*/React.createElement(Component, _extends({}, props, initialProps));
  } // flag for having wrappered


  ComponentWithInitialPropsFetch.wrapInitialPropsLoaded = true;
  ComponentWithInitialPropsFetch.displayName = 'ComponentWithInitialPropsFetch';
  return ComponentWithInitialPropsFetch;
}

function _render(_ref2) {
  var route = _ref2.route,
      opts = _ref2.opts,
      props = _ref2.props;
  var routes = renderRoutes(_objectSpread2(_objectSpread2({}, opts), {}, {
    routes: route.routes || [],
    rootRoutes: opts.rootRoutes
  }), {
    location: props.location
  });
  var Component = route.component,
      wrappers = route.wrappers;

  if (Component) {
    var defaultPageInitialProps = opts.isServer ? {} : window.g_initialProps;

    var newProps = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, props), opts.extraProps), opts.pageInitialProps || defaultPageInitialProps), {}, {
      route: route,
      routes: opts.rootRoutes
    }); // @ts-ignore


    var ret = /*#__PURE__*/React.createElement(Component, newProps, routes); // route.wrappers

    if (wrappers) {
      var len = wrappers.length - 1;

      while (len >= 0) {
        ret = /*#__PURE__*/createElement(wrappers[len], newProps, ret);
        len -= 1;
      }
    }

    return ret;
  } else {
    return routes;
  }
}

function getRouteElement(_ref3) {
  var route = _ref3.route,
      index = _ref3.index,
      opts = _ref3.opts;
  var routeProps = {
    key: route.key || index,
    exact: route.exact,
    strict: route.strict,
    sensitive: route.sensitive,
    path: route.path
  };

  if (route.redirect) {
    return /*#__PURE__*/React.createElement(Redirect, _extends({}, routeProps, {
      from: route.path,
      to: route.redirect
    }));
  } else {
    var _route$component, _route$component2, _route$component3;

    // avoid mount and unmount with url hash change
    if ( // only when SSR config enable
    opts.ssrProps && !opts.isServer && // make sure loaded once
    !((_route$component = route.component) === null || _route$component === void 0 ? void 0 : _route$component.wrapInitialPropsLoaded) && ( // TODO need a type
    ((_route$component2 = route.component) === null || _route$component2 === void 0 ? void 0 : _route$component2.getInitialProps) || ((_route$component3 = route.component) === null || _route$component3 === void 0 ? void 0 : _route$component3.preload))) {
      // client Render for enable ssr, but not sure SSR success
      route.component = wrapInitialPropsFetch(route, opts);
    }

    return /*#__PURE__*/React.createElement(Route, _extends({}, routeProps, {
      render: function render(props) {
        return _render({
          route: route,
          opts: opts,
          props: props
        });
      }
    }));
  }
}

function renderRoutes(opts) {
  var switchProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return opts.routes ? /*#__PURE__*/React.createElement(Switch, switchProps, opts.routes.map(function (route, index) {
    return getRouteElement({
      route: route,
      index: index,
      opts: _objectSpread2(_objectSpread2({}, opts), {}, {
        rootRoutes: opts.rootRoutes || opts.routes
      })
    });
  })) : null;
}

var _excluded$2 = ["history"];
function RouterComponent(props) {
  var history = props.history,
      renderRoutesProps = _objectWithoutProperties(props, _excluded$2);

  useEffect(function () {
    // first time using window.g_initialProps
    // switch route fetching data, if exact route reset window.getInitialProps
    if (window.g_useSSR) {
      window.g_initialProps = null;
    }

    function routeChangeHandler(location, action) {
      var isFirst = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var matchedRoutes = matchRoutes(props.routes, location.pathname); // Set title

      if (typeof document !== 'undefined' && renderRoutesProps.defaultTitle !== undefined) {
        document.title = matchedRoutes.length && // @ts-ignore
        matchedRoutes[matchedRoutes.length - 1].route.title || renderRoutesProps.defaultTitle || '';
      }

      props.plugin.applyPlugins({
        key: 'onRouteChange',
        type: ApplyPluginsType.event,
        args: {
          routes: props.routes,
          matchedRoutes: matchedRoutes,
          location: location,
          action: action,
          isFirst: isFirst
        }
      });
    }

    routeChangeHandler(history.location, 'POP', true);
    return history.listen(routeChangeHandler);
  }, [history]);
  return /*#__PURE__*/React.createElement(Router, {
    history: history
  }, renderRoutes(renderRoutesProps));
}

function getRootContainer(opts) {
  return opts.plugin.applyPlugins({
    type: ApplyPluginsType.modify,
    key: 'rootContainer',
    initialValue: /*#__PURE__*/React.createElement(RouterComponent, {
      history: opts.history,
      routes: opts.routes,
      plugin: opts.plugin,
      ssrProps: opts.ssrProps,
      defaultTitle: opts.defaultTitle
    }),
    args: {
      history: opts.history,
      routes: opts.routes,
      plugin: opts.plugin
    }
  });
}

// @ts-ignore
function renderClient(opts) {
  var rootContainer = getRootContainer(opts);

  if (opts.rootElement) {
    var rootElement = typeof opts.rootElement === 'string' ? document.getElementById(opts.rootElement) : opts.rootElement;

    var callback = opts.callback || function () {}; // flag showing SSR succeed


    if (window.g_useSSR) {
      ReactDOM.hydrateRoot(rootElement, rootContainer);
      callback();
    } else {
      var root = ReactDOM.createRoot(rootElement);
      root.render(rootContainer);
      callback();
    }
  } else {
    return rootContainer;
  }
}

export { renderClient, renderRoutes };
