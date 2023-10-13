/**
 * @author Kuitos
 * @since 2023-03-16
 */

import type { MatchResult } from '../module-resolver';
import { getEntireUrl } from '../utils';
import type { AssetsTranspilerOpts } from './types';
import { Mode } from './types';
import { createReusingObjectUrl, isValidJavaScriptType } from './utils';

const getCredentials = (crossOrigin: string | null): RequestInit['credentials'] | undefined => {
  switch (crossOrigin) {
    case 'anonymous':
      return 'same-origin';
    case 'use-credentials':
      return 'include';
    default:
      return undefined;
  }
};

type PreTranspileResult =
  | { mode: Mode.REMOTE_ASSETS_IN_SANDBOX; result: { src: string } }
  | { mode: Mode.REUSED_DEP_IN_SANDBOX; result: { src: string } & MatchResult }
  | { mode: Mode.INLINE_CODE_IN_SANDBOX; result: { code: string } }
  | { mode: Mode.NONE; result?: never };

export const preTranspile = (
  script: Partial<Pick<HTMLScriptElement, 'src' | 'type' | 'textContent'>>,
  baseURI: string,
  opts: AssetsTranspilerOpts,
): PreTranspileResult => {
  const { sandbox, moduleResolver } = opts;

  const { src, type } = script;

  if (sandbox) {
    if (src) {
      const entireUrl = getEntireUrl(src, baseURI);
      const matchedScript = moduleResolver?.(entireUrl);
      if (matchedScript) {
        return {
          mode: Mode.REUSED_DEP_IN_SANDBOX,
          result: { src: entireUrl, ...matchedScript },
        };
      }

      return {
        mode: Mode.REMOTE_ASSETS_IN_SANDBOX,
        result: { src: entireUrl },
      };
    }

    if (isValidJavaScriptType(type)) {
      const rawNode = opts.rawNode as HTMLScriptElement;
      const scriptNode = script.textContent ? script : rawNode.childNodes[0];

      const code = scriptNode.textContent;
      if (code) {
        return {
          mode: Mode.INLINE_CODE_IN_SANDBOX,
          result: {
            code,
          },
        };
      }
    }
  }

  return { mode: Mode.NONE };
};

export default function transpileScript(
  script: HTMLScriptElement,
  baseURI: string,
  opts: AssetsTranspilerOpts,
): HTMLScriptElement {
  // Can't use script.src directly, because it will be resolved to absolute path by browser with Node.baseURI
  // Such as <script src="./foo.js"></script> will be resolved to http://localhost:8000/foo.js while read script.src
  const srcAttribute = script.getAttribute('src');
  const { sandbox, fetch } = opts;

  // To prevent webpack from skipping reload logic and causing the js not to re-execute when a micro app is loaded multiple times, the data-webpack attribute of the script must be removed.
  // FIXME We should determine whether the current micro application is being loaded for the second time. If not, this removal should not be performed.
  script.removeAttribute('data-webpack');

  const { mode, result } = preTranspile(
    {
      src: srcAttribute || undefined,
      type: script.type,
      textContent: script.textContent,
    },
    baseURI,
    opts,
  );

  switch (mode) {
    case Mode.REMOTE_ASSETS_IN_SANDBOX: {
      const { src } = result;

      // We must remove script src to avoid self execution as we need to fetch the script content and transpile it
      script.removeAttribute('src');
      script.dataset.src = src;

      const syncMode = !script.hasAttribute('async');
      const priority: Priority = syncMode ? 'high' : 'low';
      const credentials = getCredentials(script.crossOrigin);

      void fetch(src, { credentials, priority })
        .then((res) => res.text())
        .then((code) => {
          const codeFactory = sandbox!.makeEvaluateFactory(code, src);

          // HTMLScriptElement default fetchPriority is 'auto', we should set it to 'high' to make it execute earlier while it's not async script
          if (syncMode) {
            script.fetchPriority = 'high';
          }

          script.src = URL.createObjectURL(new Blob([codeFactory], { type: 'text/javascript' }));
        });

      return script;
    }

    case Mode.INLINE_CODE_IN_SANDBOX: {
      const rawNode = opts.rawNode as HTMLScriptElement;
      const scriptNode = script.textContent ? script : rawNode.childNodes[0];
      const { code } = result;

      scriptNode.textContent = sandbox!.makeEvaluateFactory(code, baseURI);
      // mark the script have consumed
      script.dataset.consumed = 'true';

      return script;
    }

    case Mode.REUSED_DEP_IN_SANDBOX: {
      const { url, version, src } = result;

      script.dataset.src = src;
      script.dataset.version = version;

      const syncMode = !script.getAttribute('async');
      // HTMLScriptElement default fetchPriority is 'auto', we should set it to 'high' to make it execute earlier while it's not async script
      if (syncMode) {
        script.fetchPriority = 'high';
      }

      // When the script hits the dependency reuse logic, the current script is not executed, and an empty script is returned directly
      script.src = createReusingObjectUrl(src, url, 'text/javascript');

      return script;
    }

    case Mode.NONE:
    default: {
      if (srcAttribute) {
        script.src = getEntireUrl(srcAttribute, baseURI);
        return script;
      }

      return script;
    }
  }

  // TODO find entry exports
}
