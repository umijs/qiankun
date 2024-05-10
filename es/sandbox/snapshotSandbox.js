import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { SandBoxType } from '../interfaces';
function iter(obj, callbackFn) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (var prop in obj) {
    // patch for clearInterval for compatible reason, see #1490
    if (obj.hasOwnProperty(prop) || prop === 'clearInterval') {
      callbackFn(prop);
    }
  }
}
/**
 * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
 */
var SnapshotSandbox = /*#__PURE__*/function () {
  function SnapshotSandbox(name) {
    _classCallCheck(this, SnapshotSandbox);
    this.proxy = void 0;
    this.name = void 0;
    this.type = void 0;
    this.sandboxRunning = true;
    this.windowSnapshot = void 0;
    this.modifyPropsMap = {};
    this.deletePropsSet = new Set();
    this.name = name;
    this.proxy = window;
    this.type = SandBoxType.Snapshot;
  }
  _createClass(SnapshotSandbox, [{
    key: "active",
    value: function active() {
      var _this = this;
      // 记录当前快照
      this.windowSnapshot = {};
      iter(window, function (prop) {
        _this.windowSnapshot[prop] = window[prop];
      });
      // 恢复之前的变更
      Object.keys(this.modifyPropsMap).forEach(function (p) {
        window[p] = _this.modifyPropsMap[p];
      });
      // 删除之前删除的属性
      this.deletePropsSet.forEach(function (p) {
        delete window[p];
      });
      this.sandboxRunning = true;
    }
  }, {
    key: "inactive",
    value: function inactive() {
      var _this2 = this;
      this.modifyPropsMap = {};
      this.deletePropsSet.clear();
      iter(window, function (prop) {
        if (window[prop] !== _this2.windowSnapshot[prop]) {
          // 记录变更，恢复环境
          _this2.modifyPropsMap[prop] = window[prop];
          window[prop] = _this2.windowSnapshot[prop];
        }
      });
      iter(this.windowSnapshot, function (prop) {
        if (!window.hasOwnProperty(prop)) {
          // 记录被删除的属性，恢复环境
          _this2.deletePropsSet.add(prop);
          window[prop] = _this2.windowSnapshot[prop];
        }
      });
      if (process.env.NODE_ENV === 'development') {
        console.info("[qiankun:sandbox] ".concat(this.name, " origin window restore..."), Object.keys(this.modifyPropsMap), this.deletePropsSet.keys());
      }
      this.sandboxRunning = false;
    }
  }, {
    key: "patchDocument",
    value: function patchDocument() {}
  }]);
  return SnapshotSandbox;
}();
export { SnapshotSandbox as default };