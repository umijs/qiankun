/**
 * @author howel52
 * @since 2020-05-14
 */

import patch from '../UIEvent';

test('patch UIEvent', async () => {
  const free = patch();

  const dispatchEventAction = jest.fn();

  const $a = document.createElement('a');
  $a.onclick = dispatchEventAction;
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: false,
  });
  $a.dispatchEvent(evt);

  expect(dispatchEventAction).toBeCalledTimes(1);

  // free
  free();

  // @todo fixme, 使用 proxySandbox 代替 window
  // 由于 jsdom UIEvent 目前对 ProxyWindow 并不会 throw TypeError, 与浏览器行为不一致
  // see: https://github.com/jsdom/jsdom/issues/2973
  // expect(() => {
  //   const evt2 = new MouseEvent('click', {
  //     view: new Proxy(window, {}),
  //     bubbles: true,
  //     cancelable: false
  //   });
  //   $a.dispatchEvent(evt2);
  // }).toThrow("Failed to construct 'MouseEvent': member view is not of type Window.");
});
