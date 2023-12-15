import { hasOwnProperty } from '@qiankunjs/shared';

let firstGlobalProp: string | undefined, secondGlobalProp: string | undefined, lastGlobalProp: string | undefined;

export function getGlobalProp(global: WindowProxy, useFirstGlobalProp = false) {
  let cnt = 0;
  let foundLastProp, result;
  let hasIframe = false;
  for (const p in global) {
    // do not check frames because it could be removed during import
    if (shouldSkipProperty(global, p)) continue;

    // 遍历 iframe，检查 window 上的属性值是否是 iframe，是则跳过后面的 first 和 second 判断
    for (let i = 0; i < window.frames.length && !hasIframe; i++) {
      const frame = window.frames[i];
      if (frame === global[p as unknown as number]) {
        hasIframe = true;
        break;
      }
    }

    if ((!hasIframe && cnt === 0 && p !== firstGlobalProp) || (cnt === 1 && p !== secondGlobalProp)) return p;
    if (foundLastProp) {
      lastGlobalProp = p;
      result = (useFirstGlobalProp && result) || p;
    } else {
      foundLastProp = p === lastGlobalProp;
    }
    cnt++;
  }
  return result;
}

export function noteGlobalProps(global: WindowProxy) {
  // alternatively Object.keys(global).pop()
  // but this may be faster (pending benchmarks)
  firstGlobalProp = secondGlobalProp = undefined;
  for (const p in global) {
    // do not check frames because it could be removed during import
    if (shouldSkipProperty(global, p)) continue;
    if (!firstGlobalProp) firstGlobalProp = p;
    else if (!secondGlobalProp) secondGlobalProp = p;
    lastGlobalProp = p;
  }

  return lastGlobalProp;
}

const isIE11 = () => typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Trident') !== -1;
function shouldSkipProperty(global: WindowProxy, p: string | number): boolean {
  if (!hasOwnProperty(global, p) || (!isNaN(p as number) && (p as number) < global.length)) return true;

  if (isIE11()) {
    // https://github.com/kuitos/import-html-entry/pull/32，最小化 try 范围
    try {
      return !!global[p as keyof WindowProxy] && typeof window !== 'undefined' && global[p as number].parent === window;
    } catch (err) {
      return true;
    }
  } else {
    return false;
  }
}
