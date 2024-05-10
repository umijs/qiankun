"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _interfaces = require("../../interfaces");
var _common = require("../common");
function isPropConfigurable(target, prop) {
  var descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}
/**
 * 基于 Proxy 实现的沙箱
 * TODO: 为了兼容性 singular 模式下依旧使用该沙箱，等新沙箱稳定之后再切换
 */
var LegacySandbox = exports.default = /*#__PURE__*/function () {
  function LegacySandbox(name) {
    var _this = this;
    var globalContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
    (0, _classCallCheck2.default)(this, LegacySandbox);
    /** 沙箱期间新增的全局变量 */
    this.addedPropsMapInSandbox = new Map();
    /** 沙箱期间更新的全局变量 */
    this.modifiedPropsOriginalValueMapInSandbox = new Map();
    /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot */
    this.currentUpdatedPropsValueMap = new Map();
    this.name = void 0;
    this.proxy = void 0;
    this.globalContext = void 0;
    this.type = void 0;
    this.sandboxRunning = true;
    this.latestSetProp = null;
    this.name = name;
    this.globalContext = globalContext;
    this.type = _interfaces.SandBoxType.LegacyProxy;
    var addedPropsMapInSandbox = this.addedPropsMapInSandbox,
      modifiedPropsOriginalValueMapInSandbox = this.modifiedPropsOriginalValueMapInSandbox,
      currentUpdatedPropsValueMap = this.currentUpdatedPropsValueMap;
    var rawWindow = globalContext;
    var fakeWindow = Object.create(null);
    var setTrap = function setTrap(p, value, originalValue) {
      var sync2Window = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      if (_this.sandboxRunning) {
        if (!rawWindow.hasOwnProperty(p)) {
          addedPropsMapInSandbox.set(p, value);
        } else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
          // 如果当前 window 对象存在该属性，且 record map 中未记录过，则记录该属性初始值
          modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
        }
        currentUpdatedPropsValueMap.set(p, value);
        if (sync2Window) {
          // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
          rawWindow[p] = value;
        }
        _this.latestSetProp = p;
        return true;
      }
      if (process.env.NODE_ENV === 'development') {
        console.warn("[qiankun] Set window.".concat(p.toString(), " while sandbox destroyed or inactive in ").concat(name, "!"));
      }
      // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
      return true;
    };
    var proxy = new Proxy(fakeWindow, {
      set: function set(_, p, value) {
        var originalValue = rawWindow[p];
        return setTrap(p, value, originalValue, true);
      },
      get: function get(_, p) {
        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        if (p === 'top' || p === 'parent' || p === 'window' || p === 'self') {
          return proxy;
        }
        var value = rawWindow[p];
        return (0, _common.rebindTarget2Fn)(rawWindow, value);
      },
      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has: function has(_, p) {
        return p in rawWindow;
      },
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(_, p) {
        var descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
        // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object
        if (descriptor && !descriptor.configurable) {
          descriptor.configurable = true;
        }
        return descriptor;
      },
      defineProperty: function defineProperty(_, p, attributes) {
        var originalValue = rawWindow[p];
        var done = Reflect.defineProperty(rawWindow, p, attributes);
        var value = rawWindow[p];
        setTrap(p, value, originalValue, false);
        return done;
      }
    });
    this.proxy = proxy;
  }
  (0, _createClass2.default)(LegacySandbox, [{
    key: "setWindowProp",
    value: function setWindowProp(prop, value, toDelete) {
      if (value === undefined && toDelete) {
        // eslint-disable-next-line no-param-reassign
        delete this.globalContext[prop];
      } else if (isPropConfigurable(this.globalContext, prop) && (0, _typeof2.default)(prop) !== 'symbol') {
        Object.defineProperty(this.globalContext, prop, {
          writable: true,
          configurable: true
        });
        // eslint-disable-next-line no-param-reassign
        this.globalContext[prop] = value;
      }
    }
  }, {
    key: "active",
    value: function active() {
      var _this2 = this;
      if (!this.sandboxRunning) {
        this.currentUpdatedPropsValueMap.forEach(function (v, p) {
          return _this2.setWindowProp(p, v);
        });
      }
      this.sandboxRunning = true;
    }
  }, {
    key: "inactive",
    value: function inactive() {
      var _this3 = this;
      if (process.env.NODE_ENV === 'development') {
        console.info("[qiankun:sandbox] ".concat(this.name, " modified global properties restore..."), [].concat((0, _toConsumableArray2.default)(this.addedPropsMapInSandbox.keys()), (0, _toConsumableArray2.default)(this.modifiedPropsOriginalValueMapInSandbox.keys())));
      }
      // renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
      // restore global props to initial snapshot
      this.modifiedPropsOriginalValueMapInSandbox.forEach(function (v, p) {
        return _this3.setWindowProp(p, v);
      });
      this.addedPropsMapInSandbox.forEach(function (_, p) {
        return _this3.setWindowProp(p, undefined, true);
      });
      this.sandboxRunning = false;
    }
  }, {
    key: "patchDocument",
    value: function patchDocument() {}
  }]);
  return LegacySandbox;
}();