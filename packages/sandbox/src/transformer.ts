/**
 * @author Kuitos
 * @since 2023-03-14
 */

type TransformerOpts = {
  fetch: typeof window.fetch;
};

function transpileScript(script: HTMLScriptElement, baseURL: string, opts: TransformerOpts): void {
  const { src } = script;
  if (src) {
    const entireUrl = new URL(src, baseURL);
    script.removeAttribute('src');
    const scriptSrc = entireUrl.href;
    script.dataset.src = scriptSrc;

    (async () => {
      const { fetch } = opts;
      await fetch(scriptSrc)
        .then((res) => res.text())
        .then((code) => {
          const sourceUrl = `//# sourceURL=${scriptSrc}\n`;
          const scopedGlobalVariableFnParameters = ['window', 'globalThis'].join(',');
          // eslint-disable-next-line max-len
          const wrappedCode = `;with(window.proxy){(function(${scopedGlobalVariableFnParameters}){;${code}\n${sourceUrl}}).bind(window)(${scopedGlobalVariableFnParameters})};`;
          script.src = URL.createObjectURL(new Blob([wrappedCode], { type: 'application/javascript' }));
        });
    })();
  }
}

export function assetsTransformer(node: Node, context: string, opts?: { fetch: typeof window.fetch }): Node {
  const { fetch = window.fetch } = opts || {};

  const { tagName } = node as HTMLElement;

  switch (tagName) {
    case 'SCRIPT': {
      transpileScript(node as HTMLScriptElement, context, { fetch });
      break;
    }

    default:
      break;
  }

  return node;
}
