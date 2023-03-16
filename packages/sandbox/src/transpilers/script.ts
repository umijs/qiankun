/**
 * @author Kuitos
 * @since 2023-03-16
 */

import type { Compartment } from '../core/Compartment';

type TransformerOpts = {
  fetch: typeof window.fetch;
  compartment: Compartment;
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
  const { compartment } = opts;

  // Can't use script.src directly, because it will be resolved to absolute path by browser with Node.baseURI
  // Such as <script src="./foo.js"></script> will be resolved to http://localhost:8000/foo.js while read script.src
  const srcAttribute = script.getAttribute('src');
  if (srcAttribute) {
    const publicPath = new URL(baseURI, window.location.href);
    const entireUrl = new URL(srcAttribute, publicPath.toString());

    script.removeAttribute('src');

    const scriptSrc = entireUrl.href;
    script.dataset.src = scriptSrc;

    const { fetch } = opts;
    fetch(scriptSrc)
      .then((res) => res.text())
      .then((code) => {
        const evaluator = compartment.makeEvaluator(code, scriptSrc);
        script.src = URL.createObjectURL(new Blob([evaluator], { type: 'application/javascript' }));
      });
  } else if (isValidJavaScriptType(script.type)) {
    const code = script.textContent;
    if (code) {
      script.textContent = compartment.makeEvaluator(code, baseURI);
    }
  }
}
