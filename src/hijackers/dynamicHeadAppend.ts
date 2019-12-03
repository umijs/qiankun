/**
 * @author Kuitos
 * @since 2019-10-21
 */
import { execScripts } from 'import-html-entry';
import { isFunction } from 'lodash';
import { checkActivityFunctions } from 'single-spa';
import { Freer } from '../interfaces';

const rawHtmlAppendChild = HTMLHeadElement.prototype.appendChild;

const SCRIPT_TAG_NAME = 'SCRIPT';
const LINK_TAG_NAME = 'LINK';
const STYLE_TAG_NAME = 'STYLE';

export default function hijack(appName: string, proxy: Window, bootstrapping = false): Freer {
  let dynamicStyleSheets: HTMLLinkElement[] = [];

  HTMLHeadElement.prototype.appendChild = function appendChild<T extends Node>(this: any, newChild: T) {
    const element = newChild as any;
    if (element.tagName) {
      switch (element.tagName) {
        case LINK_TAG_NAME:
        case STYLE_TAG_NAME: {
          const stylesheetElement = (newChild as any) as HTMLLinkElement | HTMLStyleElement;

          // check if the currently specified application is active
          // While we switch page from qiankun app to a normal react routing page, the normal one may load stylesheet dynamically while page rendering,
          // but the url change listener must to wait until the current call stack is flushed.
          // This scenario may cause we record the stylesheet from react routing page dynamic injection,
          // and remove them after the url change triggered and qiankun app is unmouting
          // see https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L222-L230
          const activated = checkActivityFunctions(window.location).some(name => name === appName);
          // only hijack dynamic style injection when app activated
          if (activated) {
            dynamicStyleSheets.push(stylesheetElement as any);
          }

          break;
        }

        case SCRIPT_TAG_NAME: {
          const { src, text } = element as HTMLScriptElement;

          if (src) {
            execScripts(null, [src], proxy).then(
              () => {
                const loadEvent = new CustomEvent('load');
                if (isFunction(element.onload)) {
                  element.onload(loadEvent);
                } else {
                  element.dispatchEvent(loadEvent);
                }
              },
              () => {
                const errorEvent = new CustomEvent('error');
                if (isFunction(element.onerror)) {
                  element.onerror(errorEvent);
                } else {
                  element.dispatchEvent(errorEvent);
                }
              },
            );

            const dynamicScriptCommentElement = document.createComment(`dynamic script ${src} replaced by qiankun`);
            return rawHtmlAppendChild.call(this, dynamicScriptCommentElement) as T;
          }

          execScripts(null, [`<script>${text}</script>`], proxy).then(element.onload, element.onerror);
          const dynamicInlineScriptCommentElement = document.createComment('dynamic inline script replaced by qiankun');
          return rawHtmlAppendChild.call(this, dynamicInlineScriptCommentElement) as T;
        }

        default:
          break;
      }
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
