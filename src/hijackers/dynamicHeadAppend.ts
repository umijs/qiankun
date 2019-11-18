/**
 * @author Kuitos
 * @since 2019-10-21
 */
import { checkActivityFunctions } from 'single-spa';
import { execScripts } from 'import-html-entry';
import { Freer } from '../interfaces';

const rawHtmlAppendChild = HTMLHeadElement.prototype.appendChild;

const SCRIPT_TAG_NAME = 'SCRIPT';
const LINK_TAG_NAME = 'LINK';
const STYLE_TAG_NAME = 'STYLE';

export default function hijack(appName: string, proxy: Window, bootstrapping = false): Freer {
  let dynamicStyleSheets: HTMLLinkElement[] = [];
  HTMLHeadElement.prototype.appendChild = function appendChild<T extends Node>(this: any, newChild: T) {
    if (
      !(
        (newChild as any).tagName &&
        [SCRIPT_TAG_NAME, LINK_TAG_NAME, STYLE_TAG_NAME].includes((newChild as any).tagName)
      )
    ) {
      return rawHtmlAppendChild.call(this, newChild) as T;
    }

    const element = (newChild as any) as HTMLScriptElement | HTMLStyleElement | HTMLLinkElement | HTMLElement;

    if (element.tagName === SCRIPT_TAG_NAME) {
      const script = element as HTMLScriptElement;

      return script.src
        ? execScripts(null, [script.src], proxy)
        : execScripts(null, [`<script>${script.text}</script>`], proxy);
    }

    // check if the currently specified application is active
    // While we switch page from qiankun app to a normal react routing page, the normal one may load stylesheet dynamically while page rendering,
    // but the url change listener must to wait until the current call stack is flushed.
    // This scenario may cause we record the stylesheet from react routing page dynamic injection,
    // and remove them after the url change triggered and qiankun app is unmouting
    // see https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L222-L230
    const activated = checkActivityFunctions(window.location).some(name => name === appName);

    // only hijack dynamic style injection when app activated
    if (activated && (element.tagName === LINK_TAG_NAME || element.tagName === STYLE_TAG_NAME)) {
      dynamicStyleSheets.push(element as any);
    }

    return rawHtmlAppendChild.call(this, element) as T;
  };

  return function free() {
    HTMLHeadElement.prototype.appendChild = rawHtmlAppendChild;
    dynamicStyleSheets.forEach(stylesheet => {
      // the dynamic injected stylesheet may had been removed by itself while unmounting
      if (document.head.contains(stylesheet)) {
        document.head.removeChild(stylesheet);
      }
    });

    return function rebuild() {
      dynamicStyleSheets.forEach(stylesheet => document.head.appendChild(stylesheet));
      if (!bootstrapping) {
        // for gc
        dynamicStyleSheets = [];
      }
    };
  };
}
