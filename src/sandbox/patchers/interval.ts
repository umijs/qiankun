/* eslint-disable no-param-reassign */
/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';

const rawWindowInterval = window.setInterval;
// @ts-ignore
const rawWindowClearInterval = window.clearInterval;

export default function patch(global: Window) {
  let intervals: number[] = [];

  global.clearInterval = (intervalId: number) => {
    intervals = intervals.filter((id) => id !== intervalId);
    // @ts-ignore
    return rawWindowClearInterval.call(window, intervalId);
  };

  global.setInterval = (handler: CallableFunction, timeout?: number, ...args: any[]) => {
    const intervalId = rawWindowInterval(handler, timeout, ...args);
    intervals = [...intervals, intervalId];
    return intervalId;
  };

  return function free() {
    intervals.forEach((id) => global.clearInterval(id));
    global.setInterval = rawWindowInterval;
    // @ts-ignore
    global.clearInterval = rawWindowClearInterval;

    return noop;
  };
}
