/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';
import { sleep } from '../../utils';

const rawWindowInterval = window.setInterval;
const rawWindowClearInterval = window.clearInterval;
const rawWindowTimeout = window.setTimeout;
const rawWindowClearTimout = window.clearTimeout;

export default function patch() {
  let timers: number[] = [];
  let intervals: number[] = [];

  // @ts-ignore
  window.clearInterval = (intervalId: number) => {
    intervals = intervals.filter(id => id !== intervalId);
    return rawWindowClearInterval(intervalId);
  };

  // @ts-ignore
  window.setInterval = (handler: Function, timeout?: number, ...args: any[]) => {
    const intervalId = rawWindowInterval(handler, timeout, ...args);
    intervals = [...intervals, intervalId];
    return intervalId;
  };

  // @ts-ignore
  window.clearTimeout = (timerId: number) => {
    timers = timers.filter(id => id !== timerId);
    return rawWindowClearTimout(timerId);
  };

  // @ts-ignore
  window.setTimeout = (handler: Function, timeout?: number, ...args: any[]) => {
    const timerId = rawWindowTimeout(
      () => {
        handler(...args);
        // auto clear timeout to make timers length rigth
        window.clearTimeout(timerId);
      },
      timeout,
      ...args,
    );
    timers = [...timers, timerId];
    return timerId;
  };

  return function free() {
    timers.forEach(async id => {
      // FIXME 延迟 timeout 的清理，因为可能会有动画还没完成
      await sleep(500);
      window.clearTimeout(id);
    });
    intervals.forEach(id => window.clearInterval(id));

    window.setInterval = rawWindowInterval;
    window.clearInterval = rawWindowClearInterval;
    window.setTimeout = rawWindowTimeout;
    window.clearTimeout = rawWindowClearTimout;

    return noop;
  };
}
