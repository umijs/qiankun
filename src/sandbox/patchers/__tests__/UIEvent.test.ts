/**
 * @author howel52
 * @since 2020-05-14
 */

import patch from '../UIEvent';

test('patch UIEvent', async () => {
  // generate the fake window {}
  // @todo, 使用 proxySandbox 代替 fake window {}
  // 由于 jsdom UIEvent 目前对 ProxyWindow 并不会 throw TypeError, 与浏览器行为不一致
  // 通过 fake window 先模拟下
  // see: https://github.com/jsdom/jsdom/issues/2973
  const fakeWindow = {} as Window;
  (fakeWindow as any).top = fakeWindow;
  Object.defineProperty(fakeWindow, Symbol.toStringTag, {
    get() {
      return 'Window';
    },
  });

  const free = patch(fakeWindow);

  const dispatchEventAction = jest.fn();

  const $a = document.createElement('a');
  $a.onclick = dispatchEventAction;

  // @ts-ignore
  const evt = new fakeWindow.MouseEvent('click', {
    view: fakeWindow,
    bubbles: true,
    cancelable: false,
  });
  $a.dispatchEvent(evt);

  expect(dispatchEventAction).toBeCalledTimes(1);

  // free
  free();

  expect(() => {
    // @ts-ignore
    const evt2 = new fakeWindow.MouseEvent('click', {
      view: fakeWindow,
      bubbles: true,
      cancelable: false,
    });
    $a.dispatchEvent(evt2);
  }).toThrow("Failed to construct 'MouseEvent': member view is not of type Window.");

  expect(dispatchEventAction).toBeCalledTimes(1);
});
