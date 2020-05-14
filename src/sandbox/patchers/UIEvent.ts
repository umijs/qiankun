/**
 * @author howel52
 * @since 2020-05-13
 */

import { noop } from 'lodash';

const RawMouseEvent = window.MouseEvent;

class FakeMouseEvent extends MouseEvent {
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

export default function patch() {
  window.MouseEvent = FakeMouseEvent;
  return function free() {
    window.MouseEvent = RawMouseEvent;
    return noop;
  };
}
