import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _concat from "lodash/concat";
import _mergeWith2 from "lodash/mergeWith";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _forEach from "lodash/forEach";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
var _excluded = ["singular", "sandbox", "excludeAssetFilter", "globalContext"];
import _regeneratorRuntime from "@babel/runtime/regenerator";
/**
 * @author Kuitos
 * @since 2020-04-01
 */
import { importEntry } from 'import-html-entry';
import getAddOns from './addons';
import { QiankunError } from './error';
import { getMicroAppStateActions } from './globalState';
import { createSandboxContainer, css } from './sandbox';
import { cachedGlobals } from './sandbox/proxySandbox';
import { Deferred, genAppInstanceIdByName, getContainer, getDefaultTplWrapper, getWrapperId, isEnableScopedCSS, performanceGetEntriesByName, performanceMark, performanceMeasure, toArray, validateExportLifecycle } from './utils';
function assertElementExist(element, msg) {
  if (!element) {
    if (msg) {
      throw new QiankunError(msg);
    }
    throw new QiankunError('element not existed!');
  }
}
function execHooksChain(hooks, app) {
  var global = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;
  if (hooks.length) {
    return hooks.reduce(function (chain, hook) {
      return chain.then(function () {
        return hook(app, global);
      });
    }, Promise.resolve());
  }
  return Promise.resolve();
}
function validateSingularMode(_x, _x2) {
  return _validateSingularMode.apply(this, arguments);
}
function _validateSingularMode() {
  _validateSingularMode = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(validate, app) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", typeof validate === 'function' ? validate(app) : !!validate);
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _validateSingularMode.apply(this, arguments);
}
var supportShadowDOM = !!document.head.attachShadow || !!document.head.createShadowRoot;
function createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId) {
  var containerElement = document.createElement('div');
  containerElement.innerHTML = appContent;
  // appContent always wrapped with a singular div
  var appElement = containerElement.firstChild;
  if (strictStyleIsolation) {
    if (!supportShadowDOM) {
      console.warn('[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!');
    } else {
      var innerHTML = appElement.innerHTML;
      appElement.innerHTML = '';
      var shadow;
      if (appElement.attachShadow) {
        shadow = appElement.attachShadow({
          mode: 'open'
        });
      } else {
        // createShadowRoot was proposed in initial spec, which has then been deprecated
        shadow = appElement.createShadowRoot();
      }
      shadow.innerHTML = innerHTML;
    }
  }
  if (scopedCSS) {
    var attr = appElement.getAttribute(css.QiankunCSSRewriteAttr);
    if (!attr) {
      appElement.setAttribute(css.QiankunCSSRewriteAttr, appInstanceId);
    }
    var styleNodes = appElement.querySelectorAll('style') || [];
    _forEach(styleNodes, function (stylesheetElement) {
      css.process(appElement, stylesheetElement, appInstanceId);
    });
  }
  return appElement;
}
/** generate app wrapper dom getter */
function getAppWrapperGetter(appInstanceId, useLegacyRender, strictStyleIsolation, scopedCSS, elementGetter) {
  return function () {
    if (useLegacyRender) {
      if (strictStyleIsolation) throw new QiankunError('strictStyleIsolation can not be used with legacy render!');
      if (scopedCSS) throw new QiankunError('experimentalStyleIsolation can not be used with legacy render!');
      var appWrapper = document.getElementById(getWrapperId(appInstanceId));
      assertElementExist(appWrapper, "Wrapper element for ".concat(appInstanceId, " is not existed!"));
      return appWrapper;
    }
    var element = elementGetter();
    assertElementExist(element, "Wrapper element for ".concat(appInstanceId, " is not existed!"));
    if (strictStyleIsolation && supportShadowDOM) {
      return element.shadowRoot;
    }
    return element;
  };
}
var rawAppendChild = HTMLElement.prototype.appendChild;
var rawRemoveChild = HTMLElement.prototype.removeChild;
/**
 * Get the render function
 * If the legacy render function is provide, used as it, otherwise we will insert the app element to target container by qiankun
 * @param appInstanceId
 * @param appContent
 * @param legacyRender
 */
function getRender(appInstanceId, appContent, legacyRender) {
  var render = function render(_ref, phase) {
    var element = _ref.element,
      loading = _ref.loading,
      container = _ref.container;
    if (legacyRender) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[qiankun] Custom rendering function is deprecated and will be removed in 3.0, you can use the container element setting instead!');
      }
      return legacyRender({
        loading: loading,
        appContent: element ? appContent : ''
      });
    }
    var containerElement = getContainer(container);
    // The container might have be removed after micro app unmounted.
    // Such as the micro app unmount lifecycle called by a react componentWillUnmount lifecycle, after micro app unmounted, the react component might also be removed
    if (phase !== 'unmounted') {
      var errorMsg = function () {
        switch (phase) {
          case 'loading':
          case 'mounting':
            return "Target container with ".concat(container, " not existed while ").concat(appInstanceId, " ").concat(phase, "!");
          case 'mounted':
            return "Target container with ".concat(container, " not existed after ").concat(appInstanceId, " ").concat(phase, "!");
          default:
            return "Target container with ".concat(container, " not existed while ").concat(appInstanceId, " rendering!");
        }
      }();
      assertElementExist(containerElement, errorMsg);
    }
    if (containerElement && !containerElement.contains(element)) {
      // clear the container
      while (containerElement.firstChild) {
        rawRemoveChild.call(containerElement, containerElement.firstChild);
      }
      // append the element to container if it exist
      if (element) {
        rawAppendChild.call(containerElement, element);
      }
    }
    return undefined;
  };
  return render;
}
function getLifecyclesFromExports(scriptExports, appName, global, globalLatestSetProp) {
  if (validateExportLifecycle(scriptExports)) {
    return scriptExports;
  }
  // fallback to sandbox latest set property if it had
  if (globalLatestSetProp) {
    var lifecycles = global[globalLatestSetProp];
    if (validateExportLifecycle(lifecycles)) {
      return lifecycles;
    }
  }
  if (process.env.NODE_ENV === 'development') {
    console.warn("[qiankun] lifecycle not found from ".concat(appName, " entry exports, fallback to get from window['").concat(appName, "']"));
  }
  // fallback to global variable who named with ${appName} while module exports not found
  var globalVariableExports = global[appName];
  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }
  throw new QiankunError("You need to export lifecycle functions in ".concat(appName, " entry"));
}
var prevAppUnmountedDeferred;
export function loadApp(_x3) {
  return _loadApp.apply(this, arguments);
}
function _loadApp() {
  _loadApp = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17(app) {
    var _sandboxContainer, _sandboxContainer$ins;
    var configuration,
      lifeCycles,
      entry,
      appName,
      appInstanceId,
      markName,
      _configuration$singul,
      singular,
      _configuration$sandbo,
      sandbox,
      excludeAssetFilter,
      _configuration$global,
      globalContext,
      importEntryOpts,
      _yield$importEntry,
      template,
      execScripts,
      assetPublicPath,
      getExternalScripts,
      appContent,
      strictStyleIsolation,
      scopedCSS,
      initialAppWrapperElement,
      initialContainer,
      legacyRender,
      render,
      initialAppWrapperGetter,
      global,
      mountSandbox,
      unmountSandbox,
      useLooseSandbox,
      speedySandbox,
      sandboxContainer,
      _mergeWith,
      _mergeWith$beforeUnmo,
      beforeUnmount,
      _mergeWith$afterUnmou,
      afterUnmount,
      _mergeWith$afterMount,
      afterMount,
      _mergeWith$beforeMoun,
      beforeMount,
      _mergeWith$beforeLoad,
      beforeLoad,
      scriptExports,
      _getLifecyclesFromExp,
      bootstrap,
      mount,
      unmount,
      update,
      _getMicroAppStateActi,
      onGlobalStateChange,
      setGlobalState,
      offGlobalStateChange,
      syncAppWrapperElement2Sandbox,
      parcelConfigGetter,
      _args17 = arguments;
    return _regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          configuration = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : {};
          lifeCycles = _args17.length > 2 ? _args17[2] : undefined;
          entry = app.entry, appName = app.name;
          appInstanceId = genAppInstanceIdByName(appName);
          markName = "[qiankun] App ".concat(appInstanceId, " Loading");
          if (process.env.NODE_ENV === 'development') {
            performanceMark(markName);
          }
          _configuration$singul = configuration.singular, singular = _configuration$singul === void 0 ? false : _configuration$singul, _configuration$sandbo = configuration.sandbox, sandbox = _configuration$sandbo === void 0 ? true : _configuration$sandbo, excludeAssetFilter = configuration.excludeAssetFilter, _configuration$global = configuration.globalContext, globalContext = _configuration$global === void 0 ? window : _configuration$global, importEntryOpts = _objectWithoutProperties(configuration, _excluded); // get the entry html content and script executor
          _context17.next = 9;
          return importEntry(entry, importEntryOpts);
        case 9:
          _yield$importEntry = _context17.sent;
          template = _yield$importEntry.template;
          execScripts = _yield$importEntry.execScripts;
          assetPublicPath = _yield$importEntry.assetPublicPath;
          getExternalScripts = _yield$importEntry.getExternalScripts;
          _context17.next = 16;
          return getExternalScripts();
        case 16:
          _context17.next = 18;
          return validateSingularMode(singular, app);
        case 18:
          if (!_context17.sent) {
            _context17.next = 21;
            break;
          }
          _context17.next = 21;
          return prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise;
        case 21:
          appContent = getDefaultTplWrapper(appInstanceId, sandbox)(template);
          strictStyleIsolation = _typeof(sandbox) === 'object' && !!sandbox.strictStyleIsolation;
          if (process.env.NODE_ENV === 'development' && strictStyleIsolation) {
            console.warn("[qiankun] strictStyleIsolation configuration will be removed in 3.0, pls don't depend on it or use experimentalStyleIsolation instead!");
          }
          scopedCSS = isEnableScopedCSS(sandbox);
          initialAppWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId);
          initialContainer = 'container' in app ? app.container : undefined;
          legacyRender = 'render' in app ? app.render : undefined;
          render = getRender(appInstanceId, appContent, legacyRender); // 第一次加载设置应用可见区域 dom 结构
          // 确保每次应用加载前容器 dom 结构已经设置完毕
          render({
            element: initialAppWrapperElement,
            loading: true,
            container: initialContainer
          }, 'loading');
          initialAppWrapperGetter = getAppWrapperGetter(appInstanceId, !!legacyRender, strictStyleIsolation, scopedCSS, function () {
            return initialAppWrapperElement;
          });
          global = globalContext;
          mountSandbox = function mountSandbox() {
            return Promise.resolve();
          };
          unmountSandbox = function unmountSandbox() {
            return Promise.resolve();
          };
          useLooseSandbox = _typeof(sandbox) === 'object' && !!sandbox.loose; // enable speedy mode by default
          speedySandbox = _typeof(sandbox) === 'object' ? sandbox.speedy !== false : true;
          if (sandbox) {
            sandboxContainer = createSandboxContainer(appInstanceId,
            // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/qiankun/issues/518
            initialAppWrapperGetter, scopedCSS, useLooseSandbox, excludeAssetFilter, global, speedySandbox);
            // 用沙箱的代理对象作为接下来使用的全局对象
            global = sandboxContainer.instance.proxy;
            mountSandbox = sandboxContainer.mount;
            unmountSandbox = sandboxContainer.unmount;
          }
          _mergeWith = _mergeWith2({}, getAddOns(global, assetPublicPath), lifeCycles, function (v1, v2) {
            return _concat(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
          }), _mergeWith$beforeUnmo = _mergeWith.beforeUnmount, beforeUnmount = _mergeWith$beforeUnmo === void 0 ? [] : _mergeWith$beforeUnmo, _mergeWith$afterUnmou = _mergeWith.afterUnmount, afterUnmount = _mergeWith$afterUnmou === void 0 ? [] : _mergeWith$afterUnmou, _mergeWith$afterMount = _mergeWith.afterMount, afterMount = _mergeWith$afterMount === void 0 ? [] : _mergeWith$afterMount, _mergeWith$beforeMoun = _mergeWith.beforeMount, beforeMount = _mergeWith$beforeMoun === void 0 ? [] : _mergeWith$beforeMoun, _mergeWith$beforeLoad = _mergeWith.beforeLoad, beforeLoad = _mergeWith$beforeLoad === void 0 ? [] : _mergeWith$beforeLoad;
          _context17.next = 40;
          return execHooksChain(toArray(beforeLoad), app, global);
        case 40:
          _context17.next = 42;
          return execScripts(global, sandbox && !useLooseSandbox, {
            scopedGlobalVariables: speedySandbox ? cachedGlobals : []
          });
        case 42:
          scriptExports = _context17.sent;
          _getLifecyclesFromExp = getLifecyclesFromExports(scriptExports, appName, global, (_sandboxContainer = sandboxContainer) === null || _sandboxContainer === void 0 ? void 0 : (_sandboxContainer$ins = _sandboxContainer.instance) === null || _sandboxContainer$ins === void 0 ? void 0 : _sandboxContainer$ins.latestSetProp), bootstrap = _getLifecyclesFromExp.bootstrap, mount = _getLifecyclesFromExp.mount, unmount = _getLifecyclesFromExp.unmount, update = _getLifecyclesFromExp.update;
          _getMicroAppStateActi = getMicroAppStateActions(appInstanceId), onGlobalStateChange = _getMicroAppStateActi.onGlobalStateChange, setGlobalState = _getMicroAppStateActi.setGlobalState, offGlobalStateChange = _getMicroAppStateActi.offGlobalStateChange; // FIXME temporary way
          syncAppWrapperElement2Sandbox = function syncAppWrapperElement2Sandbox(element) {
            return initialAppWrapperElement = element;
          };
          parcelConfigGetter = function parcelConfigGetter() {
            var remountContainer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialContainer;
            var appWrapperElement;
            var appWrapperGetter;
            var parcelConfig = {
              name: appInstanceId,
              bootstrap: bootstrap,
              mount: [/*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                var marks;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      if (process.env.NODE_ENV === 'development') {
                        marks = performanceGetEntriesByName(markName, 'mark'); // mark length is zero means the app is remounting
                        if (marks && !marks.length) {
                          performanceMark(markName);
                        }
                      }
                    case 1:
                    case "end":
                      return _context2.stop();
                  }
                }, _callee2);
              })), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return validateSingularMode(singular, app);
                    case 2:
                      _context3.t0 = _context3.sent;
                      if (!_context3.t0) {
                        _context3.next = 5;
                        break;
                      }
                      _context3.t0 = prevAppUnmountedDeferred;
                    case 5:
                      if (!_context3.t0) {
                        _context3.next = 7;
                        break;
                      }
                      return _context3.abrupt("return", prevAppUnmountedDeferred.promise);
                    case 7:
                      return _context3.abrupt("return", undefined);
                    case 8:
                    case "end":
                      return _context3.stop();
                  }
                }, _callee3);
              })),
              /*#__PURE__*/
              // initial wrapper element before app mount/remount
              _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      appWrapperElement = initialAppWrapperElement;
                      appWrapperGetter = getAppWrapperGetter(appInstanceId, !!legacyRender, strictStyleIsolation, scopedCSS, function () {
                        return appWrapperElement;
                      });
                    case 2:
                    case "end":
                      return _context4.stop();
                  }
                }, _callee4);
              })),
              /*#__PURE__*/
              // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
              _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
                var useNewContainer;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      useNewContainer = remountContainer !== initialContainer;
                      if (useNewContainer || !appWrapperElement) {
                        // element will be destroyed after unmounted, we need to recreate it if it not exist
                        // or we try to remount into a new container
                        appWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId);
                        syncAppWrapperElement2Sandbox(appWrapperElement);
                      }
                      render({
                        element: appWrapperElement,
                        loading: true,
                        container: remountContainer
                      }, 'mounting');
                    case 3:
                    case "end":
                      return _context5.stop();
                  }
                }, _callee5);
              })), mountSandbox,
              /*#__PURE__*/
              // exec the chain after rendering to keep the behavior with beforeLoad
              _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) switch (_context6.prev = _context6.next) {
                    case 0:
                      return _context6.abrupt("return", execHooksChain(toArray(beforeMount), app, global));
                    case 1:
                    case "end":
                      return _context6.stop();
                  }
                }, _callee6);
              })), ( /*#__PURE__*/function () {
                var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(props) {
                  return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) switch (_context7.prev = _context7.next) {
                      case 0:
                        return _context7.abrupt("return", mount(_objectSpread(_objectSpread({}, props), {}, {
                          container: appWrapperGetter(),
                          setGlobalState: setGlobalState,
                          onGlobalStateChange: onGlobalStateChange
                        })));
                      case 1:
                      case "end":
                        return _context7.stop();
                    }
                  }, _callee7);
                }));
                return function (_x4) {
                  return _ref7.apply(this, arguments);
                };
              }()),
              /*#__PURE__*/
              // finish loading after app mounted
              _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) switch (_context8.prev = _context8.next) {
                    case 0:
                      return _context8.abrupt("return", render({
                        element: appWrapperElement,
                        loading: false,
                        container: remountContainer
                      }, 'mounted'));
                    case 1:
                    case "end":
                      return _context8.stop();
                  }
                }, _callee8);
              })), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9() {
                return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) switch (_context9.prev = _context9.next) {
                    case 0:
                      return _context9.abrupt("return", execHooksChain(toArray(afterMount), app, global));
                    case 1:
                    case "end":
                      return _context9.stop();
                  }
                }, _callee9);
              })),
              /*#__PURE__*/
              // initialize the unmount defer after app mounted and resolve the defer after it unmounted
              _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10() {
                return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                  while (1) switch (_context10.prev = _context10.next) {
                    case 0:
                      _context10.next = 2;
                      return validateSingularMode(singular, app);
                    case 2:
                      if (!_context10.sent) {
                        _context10.next = 4;
                        break;
                      }
                      prevAppUnmountedDeferred = new Deferred();
                    case 4:
                    case "end":
                      return _context10.stop();
                  }
                }, _callee10);
              })), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11() {
                var measureName;
                return _regeneratorRuntime.wrap(function _callee11$(_context11) {
                  while (1) switch (_context11.prev = _context11.next) {
                    case 0:
                      if (process.env.NODE_ENV === 'development') {
                        measureName = "[qiankun] App ".concat(appInstanceId, " Loading Consuming");
                        performanceMeasure(measureName, markName);
                      }
                    case 1:
                    case "end":
                      return _context11.stop();
                  }
                }, _callee11);
              }))],
              unmount: [/*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12() {
                return _regeneratorRuntime.wrap(function _callee12$(_context12) {
                  while (1) switch (_context12.prev = _context12.next) {
                    case 0:
                      return _context12.abrupt("return", execHooksChain(toArray(beforeUnmount), app, global));
                    case 1:
                    case "end":
                      return _context12.stop();
                  }
                }, _callee12);
              })), ( /*#__PURE__*/function () {
                var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13(props) {
                  return _regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) switch (_context13.prev = _context13.next) {
                      case 0:
                        return _context13.abrupt("return", unmount(_objectSpread(_objectSpread({}, props), {}, {
                          container: appWrapperGetter()
                        })));
                      case 1:
                      case "end":
                        return _context13.stop();
                    }
                  }, _callee13);
                }));
                return function (_x5) {
                  return _ref13.apply(this, arguments);
                };
              }()), unmountSandbox, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee14() {
                return _regeneratorRuntime.wrap(function _callee14$(_context14) {
                  while (1) switch (_context14.prev = _context14.next) {
                    case 0:
                      return _context14.abrupt("return", execHooksChain(toArray(afterUnmount), app, global));
                    case 1:
                    case "end":
                      return _context14.stop();
                  }
                }, _callee14);
              })), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15() {
                return _regeneratorRuntime.wrap(function _callee15$(_context15) {
                  while (1) switch (_context15.prev = _context15.next) {
                    case 0:
                      render({
                        element: null,
                        loading: false,
                        container: remountContainer
                      }, 'unmounted');
                      offGlobalStateChange(appInstanceId);
                      // for gc
                      appWrapperElement = null;
                      syncAppWrapperElement2Sandbox(appWrapperElement);
                    case 4:
                    case "end":
                      return _context15.stop();
                  }
                }, _callee15);
              })), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16() {
                return _regeneratorRuntime.wrap(function _callee16$(_context16) {
                  while (1) switch (_context16.prev = _context16.next) {
                    case 0:
                      _context16.next = 2;
                      return validateSingularMode(singular, app);
                    case 2:
                      _context16.t0 = _context16.sent;
                      if (!_context16.t0) {
                        _context16.next = 5;
                        break;
                      }
                      _context16.t0 = prevAppUnmountedDeferred;
                    case 5:
                      if (!_context16.t0) {
                        _context16.next = 7;
                        break;
                      }
                      prevAppUnmountedDeferred.resolve();
                    case 7:
                    case "end":
                      return _context16.stop();
                  }
                }, _callee16);
              }))]
            };
            if (typeof update === 'function') {
              parcelConfig.update = update;
            }
            return parcelConfig;
          };
          return _context17.abrupt("return", parcelConfigGetter);
        case 48:
        case "end":
          return _context17.stop();
      }
    }, _callee17);
  }));
  return _loadApp.apply(this, arguments);
}