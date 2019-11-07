/**
 * @author Kuitos
 * @since 2019-10-21
 */
import { checkActivityFunctions } from 'single-spa';
import { Freer } from '../interfaces';

const rawHtmlAppendChild = HTMLHeadElement.prototype.appendChild;

export default function hijack(appName: string, bootstrapping = false): Freer {
  let dynamicStyleSheets: HTMLLinkElement[] = [];
  HTMLHeadElement.prototype.appendChild = function appendChild<T extends Node>(this: any, newChild: T) {
    // check if the currently specified application is active
    // While we switch page from qiankun app to a normal react routing page, the normal one may load stylesheet dynamically while page rendering,
    // but the url change listener must to wait until the current call stack is flushed.
    // This scenario may cause we record the stylesheet from react routing page dynamic injection,
    // and remove them after the url change triggered and qiankun app is unmouting
    // see https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L222-L230
    const activated = checkActivityFunctions(window.location).some(name => name === appName);

    // only hijack dynamic style injection when app activated
    if (
      activated &&
      (newChild as any).tagName &&
      ((newChild as any).tagName === 'LINK' || (newChild as any).tagName === 'STYLE')
    ) {
      dynamicStyleSheets.push(newChild as any);
    }

    return rawHtmlAppendChild.call(this, newChild) as T;
  };

  return function free() {
    HTMLHeadElement.prototype.appendChild = rawHtmlAppendChild;
    dynamicStyleSheets.forEach(stylesheet => document.head.removeChild(stylesheet));

    return function rebuild() {
      dynamicStyleSheets.forEach(stylesheet => document.head.appendChild(stylesheet));
      if (!bootstrapping) {
        // for gc
        dynamicStyleSheets = [];
      }
    };
  };
}
