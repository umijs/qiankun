/**
 * @author Kuitos
 * @since 2023-03-16
 */

import type { Sandbox } from '@qiankunjs/sandbox';
import type { MatchResult } from '../common';
import { getEntireUrl } from '../utils';

export type TransformerOpts = {
  fetch: typeof window.fetch;
  sandbox?: Sandbox;
  moduleResolver?: (url: string) => MatchResult | undefined;
  rawNode: Node;
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

export default function transpileScript(
  script: HTMLScriptElement,
  baseURI: string,
  opts: TransformerOpts,
): HTMLScriptElement {
  // Can't use script.src directly, because it will be resolved to absolute path by browser with Node.baseURI
  // Such as <script src="./foo.js"></script> will be resolved to http://localhost:8000/foo.js while read script.src
  const srcAttribute = script.getAttribute('src');
  const { sandbox, moduleResolver } = opts;

  if (sandbox) {
    if (srcAttribute) {
      script.removeAttribute('src');

      const scriptSrc = getEntireUrl(srcAttribute, baseURI);

      // try to resolve the script from module resolver
      const matchedScript = moduleResolver?.(srcAttribute);
      if (matchedScript) {
        const { url, version } = matchedScript;
        script.dataset.src = scriptSrc;
        script.dataset.version = version;
        // When the script hits the dependency reuse logic, the current script is not executed, and an empty script is returned directly
        script.src = URL.createObjectURL(
          new Blob([`// ${srcAttribute} has reused the execution result of ${url}`], {
            type: 'application/javascript',
          }),
        );
        return script;
      }

      script.dataset.src = scriptSrc;

      const { fetch } = opts;
      void fetch(scriptSrc)
        .then((res) => res.text())
        .then((code) => {
          const codeFactory = sandbox.makeEvaluateFactory(code, scriptSrc);
          script.src = URL.createObjectURL(new Blob([codeFactory], { type: 'application/javascript' }));
        });
      return script;
    }

    if (isValidJavaScriptType(script.type)) {
      const rawNode = opts.rawNode as HTMLScriptElement;
      const scriptNode = script.textContent ? script : rawNode.childNodes[0];
      const code = scriptNode.textContent;
      if (code) {
        scriptNode.textContent = sandbox.makeEvaluateFactory(code, baseURI);
        // mark the script have consumed
        script.dataset.consumed = 'true';
        return script;
      }
    }
  }

  if (srcAttribute) {
    script.src = getEntireUrl(srcAttribute, baseURI);
    return script;
  }

  return script;

  // TODO find entry exports
}
