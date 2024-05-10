"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchStrictSandbox = patchStrictSandbox;
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _utils = require("../../../utils");
var _common = require("../../common");
var _common2 = require("./common");
/**
 * @author Kuitos
 * @since 2020-10-13
 */

var elementAttachedSymbol = Symbol('attachedApp');
// Get native global window with a sandbox disgusted way, thus we could share it between qiankun instances🤪
Object.defineProperty(_utils.nativeGlobal, '__proxyAttachContainerConfigMap__', {
  enumerable: false,
  writable: true
});
Object.defineProperty(_utils.nativeGlobal, '__currentLockingSandbox__', {
  enumerable: false,
  writable: true,
  configurable: true
});
var rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;
var rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
// Share proxyAttachContainerConfigMap between multiple qiankun instance, thus they could access the same record
_utils.nativeGlobal.__proxyAttachContainerConfigMap__ = _utils.nativeGlobal.__proxyAttachContainerConfigMap__ || new WeakMap();
var proxyAttachContainerConfigMap = _utils.nativeGlobal.__proxyAttachContainerConfigMap__;
var elementAttachContainerConfigMap = new WeakMap();
var docCreatePatchedMap = new WeakMap();
var patchMap = new WeakMap();
function patchDocument(cfg) {
  var sandbox = cfg.sandbox,
    speedy = cfg.speedy;
  var attachElementToProxy = function attachElementToProxy(element, proxy) {
    var proxyContainerConfig = proxyAttachContainerConfigMap.get(proxy);
    if (proxyContainerConfig) {
      elementAttachContainerConfigMap.set(element, proxyContainerConfig);
    }
  };
  if (speedy) {
    var modifications = {};
    var proxyDocument = new Proxy(document, {
      /**
       * Read and write must be paired, otherwise the write operation will leak to the global
       */
      set: function set(target, p, value) {
        switch (p) {
          case 'createElement':
            {
              modifications.createElement = value;
              break;
            }
          case 'querySelector':
            {
              modifications.querySelector = value;
              break;
            }
          default:
            target[p] = value;
            break;
        }
        return true;
      },
      get: function get(target, p, receiver) {
        switch (p) {
          case 'createElement':
            {
              // Must store the original createElement function to avoid error in nested sandbox
              var targetCreateElement = modifications.createElement || target.createElement;
              return function createElement() {
                if (!_utils.nativeGlobal.__currentLockingSandbox__) {
                  _utils.nativeGlobal.__currentLockingSandbox__ = sandbox.name;
                }
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }
                var element = targetCreateElement.call.apply(targetCreateElement, [target].concat(args));
                // only record the element which is created by the current sandbox, thus we can avoid the element created by nested sandboxes
                if (_utils.nativeGlobal.__currentLockingSandbox__ === sandbox.name) {
                  attachElementToProxy(element, sandbox.proxy);
                  delete _utils.nativeGlobal.__currentLockingSandbox__;
                }
                return element;
              };
            }
          case 'querySelector':
            {
              var targetQuerySelector = modifications.querySelector || target.querySelector;
              return function querySelector() {
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
                }
                var selector = args[0];
                switch (selector) {
                  case 'head':
                    {
                      var containerConfig = proxyAttachContainerConfigMap.get(sandbox.proxy);
                      if (containerConfig) {
                        var qiankunHead = (0, _common2.getAppWrapperHeadElement)(containerConfig.appWrapperGetter());
                        qiankunHead.appendChild = HTMLHeadElement.prototype.appendChild;
                        qiankunHead.insertBefore = HTMLHeadElement.prototype.insertBefore;
                        qiankunHead.removeChild = HTMLHeadElement.prototype.removeChild;
                        return qiankunHead;
                      }
                      break;
                    }
                }
                return targetQuerySelector.call.apply(targetQuerySelector, [target].concat(args));
              };
            }
          default:
            break;
        }
        var value = target[p];
        // must rebind the function to the target otherwise it will cause illegal invocation error
        if ((0, _utils.isCallable)(value) && !(0, _utils.isBoundedFunction)(value)) {
          return function proxyFunction() {
            for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              args[_key3] = arguments[_key3];
            }
            return value.call.apply(value, [target].concat((0, _toConsumableArray2.default)(args.map(function (arg) {
              return arg === receiver ? target : arg;
            }))));
          };
        }
        return value;
      }
    });
    sandbox.patchDocument(proxyDocument);
    // patch MutationObserver.prototype.observe to avoid type error
    // https://github.com/umijs/qiankun/issues/2406
    var nativeMutationObserverObserveFn = MutationObserver.prototype.observe;
    if (!patchMap.has(nativeMutationObserverObserveFn)) {
      var observe = function observe(target, options) {
        var realTarget = target instanceof Document ? _utils.nativeDocument : target;
        return nativeMutationObserverObserveFn.call(this, realTarget, options);
      };
      MutationObserver.prototype.observe = observe;
      patchMap.set(nativeMutationObserverObserveFn, observe);
    }
    // patch Node.prototype.compareDocumentPosition to avoid type error
    var prevCompareDocumentPosition = Node.prototype.compareDocumentPosition;
    if (!patchMap.has(prevCompareDocumentPosition)) {
      Node.prototype.compareDocumentPosition = function compareDocumentPosition(node) {
        var realNode = node instanceof Document ? _utils.nativeDocument : node;
        return prevCompareDocumentPosition.call(this, realNode);
      };
      patchMap.set(prevCompareDocumentPosition, Node.prototype.compareDocumentPosition);
    }
    // patch parentNode getter to avoid document === html.parentNode
    // https://github.com/umijs/qiankun/issues/2408#issuecomment-1446229105
    var parentNodeDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode');
    if (parentNodeDescriptor && !patchMap.has(parentNodeDescriptor)) {
      var parentNodeGetter = parentNodeDescriptor.get,
        configurable = parentNodeDescriptor.configurable;
      if (parentNodeGetter && configurable) {
        var patchedParentNodeDescriptor = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, parentNodeDescriptor), {}, {
          get: function get() {
            var parentNode = parentNodeGetter.call(this);
            if (parentNode instanceof Document) {
              var _getCurrentRunningApp;
              var proxy = (_getCurrentRunningApp = (0, _common.getCurrentRunningApp)()) === null || _getCurrentRunningApp === void 0 ? void 0 : _getCurrentRunningApp.window;
              if (proxy) {
                return proxy.document;
              }
            }
            return parentNode;
          }
        });
        Object.defineProperty(Node.prototype, 'parentNode', patchedParentNodeDescriptor);
        patchMap.set(parentNodeDescriptor, patchedParentNodeDescriptor);
      }
    }
    return function () {
      MutationObserver.prototype.observe = nativeMutationObserverObserveFn;
      patchMap.delete(nativeMutationObserverObserveFn);
      Node.prototype.compareDocumentPosition = prevCompareDocumentPosition;
      patchMap.delete(prevCompareDocumentPosition);
      if (parentNodeDescriptor) {
        Object.defineProperty(Node.prototype, 'parentNode', parentNodeDescriptor);
        patchMap.delete(parentNodeDescriptor);
      }
    };
  }
  var docCreateElementFnBeforeOverwrite = docCreatePatchedMap.get(document.createElement);
  if (!docCreateElementFnBeforeOverwrite) {
    var rawDocumentCreateElement = document.createElement;
    Document.prototype.createElement = function createElement(tagName, options) {
      var element = rawDocumentCreateElement.call(this, tagName, options);
      if ((0, _common2.isHijackingTag)(tagName)) {
        var _ref = (0, _common.getCurrentRunningApp)() || {},
          currentRunningSandboxProxy = _ref.window;
        if (currentRunningSandboxProxy) {
          attachElementToProxy(element, currentRunningSandboxProxy);
        }
      }
      return element;
    };
    // It means it have been overwritten while createElement is an own property of document
    if (document.hasOwnProperty('createElement')) {
      document.createElement = Document.prototype.createElement;
    }
    docCreatePatchedMap.set(Document.prototype.createElement, rawDocumentCreateElement);
  }
  return function unpatch() {
    if (docCreateElementFnBeforeOverwrite) {
      Document.prototype.createElement = docCreateElementFnBeforeOverwrite;
      document.createElement = docCreateElementFnBeforeOverwrite;
    }
  };
}
function patchStrictSandbox(appName, appWrapperGetter, sandbox) {
  var mounting = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var scopedCSS = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var excludeAssetFilter = arguments.length > 5 ? arguments[5] : undefined;
  var speedySandbox = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  var proxy = sandbox.proxy;
  var containerConfig = proxyAttachContainerConfigMap.get(proxy);
  if (!containerConfig) {
    containerConfig = {
      appName: appName,
      proxy: proxy,
      appWrapperGetter: appWrapperGetter,
      dynamicStyleSheetElements: [],
      strictGlobal: true,
      speedySandbox: speedySandbox,
      excludeAssetFilter: excludeAssetFilter,
      scopedCSS: scopedCSS
    };
    proxyAttachContainerConfigMap.set(proxy, containerConfig);
  }
  // all dynamic style sheets are stored in proxy container
  var _containerConfig = containerConfig,
    dynamicStyleSheetElements = _containerConfig.dynamicStyleSheetElements;
  var unpatchDynamicAppendPrototypeFunctions = (0, _common2.patchHTMLDynamicAppendPrototypeFunctions)(function (element) {
    return elementAttachContainerConfigMap.has(element);
  }, function (element) {
    return elementAttachContainerConfigMap.get(element);
  });
  var unpatchDocument = patchDocument({
    sandbox: sandbox,
    speedy: speedySandbox
  });
  if (!mounting) (0, _common2.calcAppCount)(appName, 'increase', 'bootstrapping');
  if (mounting) (0, _common2.calcAppCount)(appName, 'increase', 'mounting');
  return function free() {
    if (!mounting) (0, _common2.calcAppCount)(appName, 'decrease', 'bootstrapping');
    if (mounting) (0, _common2.calcAppCount)(appName, 'decrease', 'mounting');
    // release the overwritten prototype after all the micro apps unmounted
    if ((0, _common2.isAllAppsUnmounted)()) {
      unpatchDynamicAppendPrototypeFunctions();
      unpatchDocument();
    }
    (0, _common2.recordStyledComponentsCSSRules)(dynamicStyleSheetElements);
    // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmoutting
    return function rebuild() {
      (0, _common2.rebuildCSSRules)(dynamicStyleSheetElements, function (stylesheetElement) {
        var appWrapper = appWrapperGetter();
        if (!appWrapper.contains(stylesheetElement)) {
          var mountDom = stylesheetElement[_common2.styleElementTargetSymbol] === 'head' ? (0, _common2.getAppWrapperHeadElement)(appWrapper) : appWrapper;
          var refNo = stylesheetElement[_common2.styleElementRefNodeNo];
          if (typeof refNo === 'number' && refNo !== -1) {
            // the reference node may be dynamic script comment which is not rebuilt while remounting thus reference node no longer exists
            var refNode = mountDom.childNodes[refNo] || null;
            rawHeadInsertBefore.call(mountDom, stylesheetElement, refNode);
            return true;
          } else {
            rawHeadAppendChild.call(mountDom, stylesheetElement);
            return true;
          }
        }
        return false;
      });
    };
  };
}