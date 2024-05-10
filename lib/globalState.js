"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMicroAppStateActions = getMicroAppStateActions;
exports.initGlobalState = initGlobalState;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));
/**
 * @author dbkillerf6
 * @since 2020-04-10
 */

var globalState = {};
var deps = {};
// 触发全局监听
function emitGlobal(state, prevState) {
  Object.keys(deps).forEach(function (id) {
    if (deps[id] instanceof Function) {
      deps[id]((0, _cloneDeep2.default)(state), (0, _cloneDeep2.default)(prevState));
    }
  });
}
function initGlobalState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  if (process.env.NODE_ENV === 'development') {
    console.warn("[qiankun] globalState tools will be removed in 3.0, pls don't use it!");
  }
  if (state === globalState) {
    console.warn('[qiankun] state has not changed！');
  } else {
    var prevGlobalState = (0, _cloneDeep2.default)(globalState);
    globalState = (0, _cloneDeep2.default)(state);
    emitGlobal(globalState, prevGlobalState);
  }
  return getMicroAppStateActions("global-".concat(+new Date()), true);
}
function getMicroAppStateActions(id, isMaster) {
  return {
    /**
     * onGlobalStateChange 全局依赖监听
     *
     * 收集 setState 时所需要触发的依赖
     *
     * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onGlobalStateChange
     *
     * 这么设计是为了减少全局监听滥用导致的内存爆炸
     *
     * 依赖数据结构为：
     * {
     *   {id}: callback
     * }
     *
     * @param callback
     * @param fireImmediately
     */
    onGlobalStateChange: function onGlobalStateChange(callback, fireImmediately) {
      if (!(callback instanceof Function)) {
        console.error('[qiankun] callback must be function!');
        return;
      }
      if (deps[id]) {
        console.warn("[qiankun] '".concat(id, "' global listener already exists before this, new listener will overwrite it."));
      }
      deps[id] = callback;
      if (fireImmediately) {
        var cloneState = (0, _cloneDeep2.default)(globalState);
        callback(cloneState, cloneState);
      }
    },
    /**
     * setGlobalState 更新 store 数据
     *
     * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
     * 2. 修改 store 并触发全局监听
     *
     * @param state
     */
    setGlobalState: function setGlobalState() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (state === globalState) {
        console.warn('[qiankun] state has not changed！');
        return false;
      }
      var changeKeys = [];
      var prevGlobalState = (0, _cloneDeep2.default)(globalState);
      globalState = (0, _cloneDeep2.default)(Object.keys(state).reduce(function (_globalState, changeKey) {
        if (isMaster || _globalState.hasOwnProperty(changeKey)) {
          changeKeys.push(changeKey);
          return Object.assign(_globalState, (0, _defineProperty2.default)({}, changeKey, state[changeKey]));
        }
        console.warn("[qiankun] '".concat(changeKey, "' not declared when init state\uFF01"));
        return _globalState;
      }, globalState));
      if (changeKeys.length === 0) {
        console.warn('[qiankun] state has not changed！');
        return false;
      }
      emitGlobal(globalState, prevGlobalState);
      return true;
    },
    // 注销该应用下的依赖
    offGlobalStateChange: function offGlobalStateChange() {
      delete deps[id];
      return true;
    }
  };
}