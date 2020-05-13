// @ts-nocheck
// @todo remove ts-nocheck, add tests
/**
 * @auther howel52
 * @since 2020-05-13
 */

import { noop } from 'lodash';

const RawMouseEvent = window.MouseEvent;

class FakeMouseEvent {
  constructor(typeArg: string, mouseEventInit?: MouseEventInit) {
    const { view, ...otherOpts } = mouseEventInit || {};

    // if UIEvent want to window view, we should replace ProxyWindow with Window
    // see: https://github.com/umijs/qiankun/issues/570
    // eg: https://github.com/apache/incubator-echarts/blob/master/src/component/toolbox/feature/SaveAsImage.js#L63...L75
    return Object.prototype.toString.call(view) === '[object Window]'
      ? new RawMouseEvent(typeArg, { view: window, ...otherOpts })
      : new RawMouseEvent(typeArg, mouseEventInit);
  }
}

export default function patch() {
  window.MouseEvent = FakeMouseEvent;
  return function free() {
    window.MouseEvent = RawMouseEvent;
    return noop;
  };
}
