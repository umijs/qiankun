/**
 * @author Kuitos
 * @since 2020-03-30
 */

import { sleep } from '../../../utils';
import patch from '../timer';

test('patch setTimeout', async () => {
  const free = patch();

  const clearedListener = jest.fn();
  const autoClearedListener = jest.fn();
  const unclearedListener = jest.fn();
  const unclearedListenerWithArgs = jest.fn();

  const timer1 = window.setTimeout(clearedListener, 60);
  window.setTimeout(autoClearedListener, 0, 'kuitos');
  window.setTimeout(unclearedListener, 1000);
  window.setTimeout(unclearedListenerWithArgs, 1000, 'kuitos');

  window.clearTimeout(timer1);

  await sleep(10);
  free();

  expect(clearedListener).toBeCalledTimes(0);
  expect(autoClearedListener).toBeCalledTimes(1);
  expect(autoClearedListener).toBeCalledWith('kuitos');
  expect(unclearedListener).toBeCalledTimes(0);
  expect(unclearedListenerWithArgs).toBeCalledTimes(0);
});

test('patch setInterval', async () => {
  const free = patch();

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
