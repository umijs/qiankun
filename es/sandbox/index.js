import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import LegacySandbox from './legacy/sandbox';
import { patchAtBootstrapping, patchAtMounting } from './patchers';
import ProxySandbox from './proxySandbox';
import SnapshotSandbox from './snapshotSandbox';
export { getCurrentRunningApp } from './common';
export { css } from './patchers';
/**
 * 生成应用运行时沙箱
 *
 * 沙箱分两个类型：
 * 1. app 环境沙箱
 *  app 环境沙箱是指应用初始化过之后，应用会在什么样的上下文环境运行。每个应用的环境沙箱只会初始化一次，因为子应用只会触发一次 bootstrap 。
 *  子应用在切换时，实际上切换的是 app 环境沙箱。
 * 2. render 沙箱
 *  子应用在 app mount 开始前生成好的的沙箱。每次子应用切换过后，render 沙箱都会重现初始化。
 *
 * 这么设计的目的是为了保证每个子应用切换回来之后，还能运行在应用 bootstrap 之后的环境下。
 *
 * @param appName
 * @param elementGetter
 * @param scopedCSS
 * @param useLooseSandbox
 * @param excludeAssetFilter
 * @param globalContext
 * @param speedySandBox
 */
export function createSandboxContainer(appName, elementGetter, scopedCSS, useLooseSandbox, excludeAssetFilter, globalContext, speedySandBox) {
  var sandbox;
  if (window.Proxy) {
    sandbox = useLooseSandbox ? new LegacySandbox(appName, globalContext) : new ProxySandbox(appName, globalContext, {
      speedy: !!speedySandBox
    });
  } else {
    sandbox = new SnapshotSandbox(appName);
  }
  // some side effect could be invoked while bootstrapping, such as dynamic stylesheet injection with style-loader, especially during the development phase
  var bootstrappingFreers = patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox);
  // mounting freers are one-off and should be re-init at every mounting time
  var mountingFreers = [];
  var sideEffectsRebuilders = [];
  return {
    instance: sandbox,
    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    mount: function mount() {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var sideEffectsRebuildersAtBootstrapping, sideEffectsRebuildersAtMounting;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              /* ------------------------------------------ 因为有上下文依赖（window），以下代码执行顺序不能变 ------------------------------------------ */
              /* ------------------------------------------ 1. 启动/恢复 沙箱------------------------------------------ */
              sandbox.active();
              sideEffectsRebuildersAtBootstrapping = sideEffectsRebuilders.slice(0, bootstrappingFreers.length);
              sideEffectsRebuildersAtMounting = sideEffectsRebuilders.slice(bootstrappingFreers.length); // must rebuild the side effects which added at bootstrapping firstly to recovery to nature state
              if (sideEffectsRebuildersAtBootstrapping.length) {
                sideEffectsRebuildersAtBootstrapping.forEach(function (rebuild) {
                  return rebuild();
                });
              }
              /* ------------------------------------------ 2. 开启全局变量补丁 ------------------------------------------*/
              // render 沙箱启动时开始劫持各类全局监听，尽量不要在应用初始化阶段有 事件监听/定时器 等副作用
              mountingFreers = patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox);
              /* ------------------------------------------ 3. 重置一些初始化时的副作用 ------------------------------------------*/
              // 存在 rebuilder 则表明有些副作用需要重建
              if (sideEffectsRebuildersAtMounting.length) {
                sideEffectsRebuildersAtMounting.forEach(function (rebuild) {
                  return rebuild();
                });
              }
              // clean up rebuilders
              sideEffectsRebuilders = [];
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    },
    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    unmount: function unmount() {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              // record the rebuilders of window side effects (event listeners or timers)
              // note that the frees of mounting phase are one-off as it will be re-init at next mounting
              sideEffectsRebuilders = [].concat(_toConsumableArray(bootstrappingFreers), _toConsumableArray(mountingFreers)).map(function (free) {
                return free();
              });
              sandbox.inactive();
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }))();
    }
  };
}