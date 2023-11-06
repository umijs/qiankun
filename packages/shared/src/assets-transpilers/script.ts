/**
 * @author Kuitos
 * @since 2023-03-16
 */

import type { MatchResult } from '../module-resolver';
import { getEntireUrl, waitUntilSettled } from '../utils';
import type { AssetsTranspilerOpts, ScriptTranspilerOpts } from './types';
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
  | { mode: Mode.REMOTE_ASSETS_IN_SANDBOX | Mode.REMOTE_ASSETS; result: { src: string } }
  | { mode: Mode.REUSED_DEP_IN_SANDBOX | Mode.REUSED_DEP; result: { src: string } & MatchResult }
  | { mode: Mode.INLINE_CODE_IN_SANDBOX; result: { code: string } }
  | { mode: Mode.NONE; result?: never };

export const preTranspile = (
  script: Partial<Pick<HTMLScriptElement, 'src' | 'type' | 'textContent'>>,
  baseURI: string,
  opts: AssetsTranspilerOpts,
): PreTranspileResult => {
  const { sandbox, moduleResolver } = opts;

  const { src, type } = script;

  if (src) {
    const entireUrl = getEntireUrl(src, baseURI);
    const matchedScript = moduleResolver?.(entireUrl);
    if (matchedScript) {
      return {
        mode: sandbox ? Mode.REUSED_DEP_IN_SANDBOX : Mode.REUSED_DEP,
        result: { src: entireUrl, ...matchedScript },
      };
    }

    return {
      mode: sandbox ? Mode.REMOTE_ASSETS_IN_SANDBOX : Mode.REMOTE_ASSETS,
      result: { src: entireUrl },
    };
  }

  if (isValidJavaScriptType(type) && sandbox) {
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

  return { mode: Mode.NONE };
};

export default function transpileScript(
  script: HTMLScriptElement,
  baseURI: string,
  opts: ScriptTranspilerOpts,
): HTMLScriptElement {
  // Can't use script.src directly, because it will be resolved to absolute path by browser with Node.baseURI
  // Such as <script src="./foo.js"></script> will be resolved to http://localhost:8000/foo.js while read script.src
  const srcAttribute = script.getAttribute('src');
  const { sandbox, scriptTranspiledDeferred } = opts;

  // To prevent webpack from skipping reload logic and causing the js not to re-execute when a micro app is loaded multiple times, the data-webpack attribute of the script must be removed.
  // see https://github.com/webpack/webpack/blob/1f13ff9fe587e094df59d660b4611b1bd19aed4c/lib/runtime/LoadScriptRuntimeModule.js#L131-L136
  // FIXME We should determine whether the current micro application is being loaded for the second time. If not, this removal should not be performed.
  script.removeAttribute('data-webpack');

  try {
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
        const { fetch } = opts;
        const { src } = result;

        // We must remove script src to avoid self execution as we need to fetch the script content and transpile it
        script.removeAttribute('src');
        script.dataset.src = src;

        const syncMode = !script.hasAttribute('async');
        const priority: Priority = syncMode ? 'high' : 'low';
        const credentials = getCredentials(script.crossOrigin);

        void fetch(src, { credentials, priority })
          .then((res) => res.text())
          .then(async (code) => {
            const { prevScriptTranspiledDeferred } = opts;
            const codeFactory = sandbox!.makeEvaluateFactory(code, src);

            if (syncMode) {
              // if it's a sync script and there is a previous sync script, we should wait it to finish fetching
              if (prevScriptTranspiledDeferred && !prevScriptTranspiledDeferred.isSettled()) {
                await waitUntilSettled(prevScriptTranspiledDeferred.promise);
              }

              // HTMLScriptElement default fetchPriority is 'auto', we should set it to 'high' to make it execute earlier while it's not async script
              script.fetchPriority = 'high';
            }

            script.src = URL.createObjectURL(new Blob([codeFactory], { type: 'text/javascript' }));
            scriptTranspiledDeferred?.resolve();
          })
          .catch((e) => {
            scriptTranspiledDeferred?.reject();
            throw e;
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

        scriptTranspiledDeferred?.resolve();

        return script;
      }

      case Mode.REUSED_DEP_IN_SANDBOX:
      case Mode.REUSED_DEP: {
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

        scriptTranspiledDeferred?.resolve();

        return script;
      }

      case Mode.REMOTE_ASSETS:
      case Mode.NONE:
      default: {
        if (result?.src) {
          script.src = result.src;
        }

        scriptTranspiledDeferred?.resolve();

        return script;
      }
    }
  } catch (e) {
    scriptTranspiledDeferred?.reject(e);
    throw e;
  }
}
