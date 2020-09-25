/**
 * @author Kuitos
 * @since 2020-03-30
 */

import { sleep } from '../../../utils';
import patch from '../interval';

test('patch setInterval', async () => {
  const free = patch(window);

  const clearedListener = jest.fn();
  const unclearedListener = jest.fn();
  const unclearedListenerWithArgs = jest.fn();

  const interval1 = window.setInterval(clearedListener, 60);
  window.setInterval(unclearedListener, 8);
  window.setInterval(unclearedListenerWithArgs, 30, 'kuitos');

  window.clearInterval(interval1);

  await sleep(10);
  free();

  expect(clearedListener).toBeCalledTimes(0);
  expect(unclearedListener).toBeCalledTimes(1);
  expect(unclearedListenerWithArgs).toBeCalledTimes(0);
});
