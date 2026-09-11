/**
 * @author Kuitos
 * @since 2023-04-25
 */
export function toArray<T>(array: T | T[]): T[] {
  return Array.isArray(array) ? array : [array];
}

const supportsUserTiming =
  typeof performance !== 'undefined' &&
  typeof performance.mark === 'function' &&
  typeof performance.clearMarks === 'function' &&
  typeof performance.measure === 'function' &&
  typeof performance.clearMeasures === 'function' &&
  typeof performance.getEntriesByName === 'function';

export function performanceGetEntriesByName(markName: string, type?: string) {
  let marks = null;
  if (supportsUserTiming) {
    marks = performance.getEntriesByName(markName, type);
  }
  return marks;
}

export function performanceMark(markName: string) {
  if (supportsUserTiming) {
    performance.mark(markName);
  }
}

export function performanceMeasure(measureName: string, markName: string) {
  if (supportsUserTiming && performance.getEntriesByName(markName, 'mark').length) {
    performance.measure(measureName, markName);
    performance.clearMarks(markName);
    performance.clearMeasures(measureName);
  }
}

export async function getPureHTMLStringWithoutScripts(entry: string, fetch: typeof window.fetch): Promise<string> {
  const htmlString = await fetch(entry).then((r) => r.text());

  const domParser = new DOMParser();
  const htmlDOM = domParser.parseFromString(htmlString, 'text/html');
  // remove all script tags who are been loaded before
  htmlDOM.querySelectorAll('script').forEach((script) => script.remove());
  htmlDOM.querySelectorAll('link[rel=prefetch],link[rel=preload]').forEach((link) => link.remove());

  return htmlDOM.documentElement.outerHTML;
}

/** Stop waiting without leaving an abort listener on successfully settled work. */
export function withAbortSignal<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const abort = () => reject(signal.reason instanceof Error ? signal.reason : new Error(String(signal.reason)));
    if (signal.aborted) abort();
    else signal.addEventListener('abort', abort, { once: true });
    void promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}
