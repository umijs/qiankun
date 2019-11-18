import { execScripts } from 'import-html-entry';
import { Freer } from '../interfaces';

export default function hijack(proxy: Window): Freer {
  const rawHtmlAppendChild = HTMLHeadElement.prototype.appendChild;

  function wrapHtmlAppendChild<T extends Node>(this: any, child: T) {
    if ((child as any).tagName !== 'SCRIPT') return rawHtmlAppendChild.call(this, child);

    const script = (child as any) as HTMLScriptElement;
    if (script.src) {
      return execScripts(null, [script.src], proxy);
    }

    return execScripts(null, [`<script>${script.text}</script>`], proxy);
  }

  HTMLHeadElement.prototype.appendChild = wrapHtmlAppendChild;

  return function free() {
    HTMLHeadElement.prototype.appendChild = rawHtmlAppendChild;
    return function rebuild() {
      HTMLHeadElement.prototype.appendChild = wrapHtmlAppendChild;
    };
  };
}
