/**
 * @author howel52
 * @since 2020-05-13
 */

import { noop } from 'lodash';

const RawMouseEvent = window.MouseEvent;

declare global {
  interface Window {
    MouseEvent: MouseEvent;
  }
}
// if ts compile target is es5, the native super/extends has some problems
// see: https://github.com/microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
class FakeMouseEvent extends RawMouseEvent {
  constructor(typeArg: string, mouseEventInit?: MouseEventInit) {
    // if UIEvent want to window view, we should replace ProxyWindow with Window
    if (mouseEventInit && Object.prototype.toString.call(mouseEventInit.view) === '[object Window]') {
      // resolve: https://github.com/umijs/qiankun/issues/570
      // eg: https://github.com/apache/incubator-echarts/blob/master/src/component/toolbox/feature/SaveAsImage.js#L63...L75
      mouseEventInit.view = window;
    }
    super(typeArg, mouseEventInit);
  }
}

export default function patch(global: Window) {
  global.MouseEvent = FakeMouseEvent;
  return function free() {
    global.MouseEvent = RawMouseEvent;
    return noop;
  };
}
