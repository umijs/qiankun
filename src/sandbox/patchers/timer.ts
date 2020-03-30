/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';

const rawWindowInterval = window.setInterval;
const rawWindowClearInterval = window.clearInterval;
const rawWindowTimeout = window.setTimeout;
const rawWindowClearTimout = window.clearTimeout;

export default function patch() {
  let timers: Array<{ id: number; handler: Function; args: any[] }> = [];
  let intervals: Array<{ id: number; handler: Function; args: any[] }> = [];

  // @ts-ignore
  window.clearInterval = (intervalId: number) => {
    intervals = intervals.filter(({ id }) => id !== intervalId);
    return rawWindowClearInterval(intervalId);
  };

  // @ts-ignore
  window.setInterval = (handler: Function, timeout?: number, ...args: any[]) => {
    const intervalId = rawWindowInterval(handler, timeout, ...args);
    intervals = [...intervals, { id: intervalId, handler, args }];
    return intervalId;
  };

  // @ts-ignore
  window.clearTimeout = (timerId: number) => {
    timers = timers.filter(({ id }) => id !== timerId);
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
    timers = [...timers, { id: timerId, handler, args }];
    return timerId;
  };

  return function free() {
    window.setInterval = rawWindowInterval;
    window.clearInterval = rawWindowClearInterval;
    window.setTimeout = rawWindowTimeout;
    window.clearTimeout = rawWindowClearTimout;

    timers.forEach(({ handler, id, args }) => {
      // clear the timers and execute its handler to avoid uncleared effects
      // such as antd auto closing message
      handler(...args);
      window.clearTimeout(id);
    });

    intervals.forEach(({ id, args, handler }) => {
      // clear the interval and execute its handler
      handler(...args);
      window.clearInterval(id);
    });

    return noop;
  };
}
