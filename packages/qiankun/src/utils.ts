/**
 * @author Kuitos
 * @since 2023-04-25
 */
export function toArray<T>(array: T | T[]): T[] {
  return Array.isArray(array) ? array : [array];
}

/**
 * copy from https://developer.mozilla.org/zh-CN/docs/Using_XPath
 * @param el
 * @param document
 */
function getXPathForElement(el: Node, document: Document): string | void {
  // not support that if el not existed in document yet(such as it not append to document before it mounted)
  if (!document.body.contains(el)) {
    return undefined;
  }

  let xpath = '';
  let pos;
  let tmpEle;
  let element = el;

  while (element !== document.documentElement) {
    pos = 0;
    tmpEle = element;
    while (tmpEle) {
      if (tmpEle.nodeType === 1 && tmpEle.nodeName === element.nodeName) {
        // If it is ELEMENT_NODE of the same name
        pos += 1;
      }
      tmpEle = tmpEle.previousSibling;
    }

    xpath = `*[name()='${element.nodeName}'][${pos}]/${xpath}`;

    element = element.parentNode!;
  }

  xpath = `/*[name()='${document.documentElement.nodeName}']/${xpath}`;
  xpath = xpath.replace(/\/$/, '');

  return xpath;
}

export function getContainer(container: string | HTMLElement): HTMLElement | null {
  return typeof container === 'string' ? document.querySelector(container) : container;
}

export function getContainerXPath(container?: string | HTMLElement): string | void {
  if (container) {
    const containerElement = getContainer(container);
    if (containerElement) {
      return getXPathForElement(containerElement, document);
    }
  }

  return undefined;
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
