/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';

const rawWindowInterval = window.setInterval;
const rawWindowClearInterval = window.clearInterval;

export default function patch() {
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

  return function free() {
    intervals.forEach(id => window.clearInterval(id));
    window.setInterval = rawWindowInterval;
    window.clearInterval = rawWindowClearInterval;

    return noop;
  };
}
