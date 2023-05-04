/**
 * @author Kuitos
 * @since 2023-03-16
 */

import type { Compartment } from '@qiankunjs/sandbox';
import { nativeGlobal } from '@qiankunjs/sandbox';
import { getEntireUrl } from '../utils';
import { getGlobalProp, noteGlobalProps } from './utils';

export type TransformerOpts = {
  fetch: typeof window.fetch;
  compartment?: Compartment;
};

const isValidJavaScriptType = (type?: string): boolean => {
  const handleTypes = [
    'text/javascript',
    'module',
    'application/javascript',
    'text/ecmascript',
    'application/ecmascript',
  ];
  return !type || handleTypes.indexOf(type) !== -1;
};

export default function transpileScript(script: HTMLScriptElement, baseURI: string, opts: TransformerOpts): void {
  // Can't use script.src directly, because it will be resolved to absolute path by browser with Node.baseURI
  // Such as <script src="./foo.js"></script> will be resolved to http://localhost:8000/foo.js while read script.src
  const srcAttribute = script.getAttribute('src');
  const { compartment } = opts;

  if (compartment) {
    if (srcAttribute) {
      script.removeAttribute('src');

      const scriptSrc = getEntireUrl(srcAttribute, baseURI);
      script.dataset.src = scriptSrc;

      const { fetch } = opts;
      fetch(scriptSrc)
        .then((res) => res.text())
        .then((code) => {
          const codeFactory = compartment.makeEvaluateFactory(code, scriptSrc);
          script.src = URL.createObjectURL(new Blob([codeFactory], { type: 'application/javascript' }));
        });
    } else if (isValidJavaScriptType(script.type)) {
      const code = script.textContent;
      if (code) {
        script.textContent = compartment.makeEvaluateFactory(code, baseURI);
      }
    }
  } else {
    if (srcAttribute) {
      script.src = getEntireUrl(srcAttribute, baseURI);
    }
  }

  // TODO find entry exports
}

nativeGlobal.__qiankun_audit_pre_script__ = noteGlobalProps;
nativeGlobal.__qiankun_audit_post_script__ = getGlobalProp;

function createPreAuditScript(compartment: Compartment): HTMLScriptElement {
  const preAuditScript = document.createElement('script');
  preAuditScript.textContent = `
    window.__qiankun_audit_pre_script__(window.${compartment.id});
    `;

  return preAuditScript;
}

function createPostAuditScript(compartment: Compartment): HTMLScriptElement {
  const postAuditScript = document.createElement('script');
  postAuditScript.textContent = `
    window.__qiankun_audit_post_script__(window.${compartment.id});
    `;

  return postAuditScript;
}
