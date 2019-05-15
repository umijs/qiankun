/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';
import { sleep } from '../utils';

export default function hijack() {

  const rawWindowInterval = window.setInterval.bind(window);
  const rawWindowTimeout = window.setTimeout.bind(window);
  const timerIds: number[] = [];
  const intervalIds: number[] = [];

  window.setInterval = (...args: any[]) => {
    // @ts-ignore
    const intervalId = rawWindowInterval(...args);
    intervalIds.push(intervalId);
    return intervalId;
  };

  window.setTimeout = (...args: any[]) => {
    // @ts-ignore
    const timerId = rawWindowTimeout(...args);
    timerIds.push(timerId);
    return timerId;
  };

  return function free() {
    window.setInterval = rawWindowInterval;
    window.setTimeout = rawWindowTimeout;

    timerIds.forEach(async id => {
      // 延迟 timeout 的清理，因为可能会有动画还没完成
      await sleep(500);
      window.clearTimeout(id);
    });
    intervalIds.forEach(id => {
      window.clearInterval(id);
    });

    return noop;
  };
}
