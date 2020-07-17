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

export default function patch(global: Window) {
  // if ts compile target is es5, the native super/extends has some problems
  // see: https://github.com/microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
  class FakeMouseEvent extends RawMouseEvent {
    constructor(typeArg: string, mouseEventInit?: MouseEventInit) {
      // if UIEvent want to window view, we should replace ProxyWindow with Window
      if (mouseEventInit && mouseEventInit.view?.top === mouseEventInit.view) {
        // resolve: https://github.com/umijs/qiankun/issues/570
        // eg: https://github.com/apache/incubator-echarts/blob/master/src/component/toolbox/feature/SaveAsImage.js#L63...L75
        // eslint-disable-next-line no-param-reassign
        mouseEventInit.view = window;
      }
      super(typeArg, mouseEventInit);
    }
  }

  // eslint-disable-next-line no-param-reassign
  global.MouseEvent = FakeMouseEvent;

  return function free() {
    // eslint-disable-next-line no-param-reassign
    global.MouseEvent = RawMouseEvent;
    return noop;
  };
}
