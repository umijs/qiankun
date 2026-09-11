/**
 * @author Kuitos
 * @since 2023-03-16
 */

import type { MatchResult } from '../module-resolver';
import { resolveUrl, waitUntilSettled } from '../utils';
import { consumeImportMapScript, isImportMapScriptType, transpileModuleScript } from './module';
import type { AssetsTranspilerOpts, ScriptTranspilerOpts } from './types';
import { Mode } from './types';
import { isValidJavaScriptType } from './utils';

type AssetScope = {
  controller: AbortController;
  cleanups: Set<() => void>;
  reusedUrls: Map<string, string>;
};
const assetScopes = new WeakMap<object, AssetScope>();

/** Internal lifetime shared by classic scripts and links owned by one compartment/fetch scope. */
export function getAssetScope(owner: object): AssetScope {
  let scope = assetScopes.get(owner);
  if (!scope) {
    scope = { controller: new AbortController(), cleanups: new Set(), reusedUrls: new Map() };
    assetScopes.set(owner, scope);
  }
  return scope;
}

export function disposeCompartmentAssets(owner: object): void {
  const scope = getAssetScope(owner);
  if (scope.controller.signal.aborted) return;
  scope.controller.abort(new DOMException('The asset owner has been disposed', 'AbortError'));
  const errors: unknown[] = [];
  for (const cleanup of scope.cleanups) {
    try {
      cleanup();
    } catch (error) {
      errors.push(error);
    }
  }
  scope.cleanups.clear();
  for (const url of scope.reusedUrls.values()) URL.revokeObjectURL(url);
  scope.reusedUrls.clear();
  if (errors.length) throw errors[0];
}

/** Reuse placeholders live only as long as their owner, including preload consumers. */
export function getScopedReusingObjectUrl(
  owner: object,
  src: string,
  url: string,
  type: 'text/javascript' | 'text/css',
): string {
  const scope = getAssetScope(owner);
  scope.controller.signal.throwIfAborted();
  const key = `${src}#${url}#${type}`;
  let blobUrl = scope.reusedUrls.get(key);
  if (!blobUrl) {
    blobUrl = URL.createObjectURL(new Blob([`/* ${src} is reusing the execution result of ${url} */`], { type }));
    scope.reusedUrls.set(key, blobUrl);
  }
  return blobUrl;
}

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
  const { compartment, moduleResolver } = opts;

  const { src, type } = script;

  if (src) {
    const entireUrl = resolveUrl(src, baseURI);
    const matchedScript = moduleResolver?.(entireUrl);
    if (matchedScript) {
      return {
        mode: compartment ? Mode.REUSED_DEP_IN_SANDBOX : Mode.REUSED_DEP,
        result: { src: entireUrl, ...matchedScript },
      };
    }

    return {
      mode: compartment ? Mode.REMOTE_ASSETS_IN_SANDBOX : Mode.REMOTE_ASSETS,
      result: { src: entireUrl },
    };
  }

  if (isValidJavaScriptType(type) && compartment) {
    const code = script.textContent;
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
  const { classicScriptTransformer, compartment, scriptTranspiledDeferred } = opts;
  const owner = compartment ?? opts.fetch;
  const scope = getAssetScope(owner);
  scope.controller.signal.throwIfAborted();

  try {
    // ESM sandbox branch: module scripts and sub app import maps are taken over by the engine
    if (compartment) {
      if (script.type === 'module') {
        return transpileModuleScript(script, baseURI, compartment, opts);
      }
      if (isImportMapScriptType(script.type)) {
        const transformed = consumeImportMapScript(script, baseURI, compartment);
        scriptTranspiledDeferred?.resolve();
        return transformed;
      }
    }

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
        const priority: RequestPriority = syncMode ? 'high' : 'low';
        const credentials = getCredentials(script.crossOrigin);

        let blobUrl: string | undefined;
        let beforeExecutedListener: EventListener | undefined;
        const releaseExecutionResources = () => {
          if (blobUrl) URL.revokeObjectURL(blobUrl);
          blobUrl = undefined;
          if (beforeExecutedListener) window.removeEventListener('q:bse', beforeExecutedListener);
          beforeExecutedListener = undefined;
          scope.cleanups.delete(cancelScript);
        };
        const cancelScript = () => {
          releaseExecutionResources();
          script.onload = script.onerror = null;
          script.remove();
          script.removeAttribute('src');
          scriptTranspiledDeferred?.reject(scope.controller.signal.reason);
        };
        scope.cleanups.add(cancelScript);

        void fetch(src, { credentials, priority, signal: scope.controller.signal })
          .then((res) => res.text())
          .then(async (code) => {
            scope.controller.signal.throwIfAborted();
            const { prevScriptTranspiledDeferred } = opts;

            // add preprocess code to dispatch a CustomEvent before the script is executed
            const beforeScriptExecuteEvent = 'q:bse';
            const beforeExecutedListenerScript = `;(function(){var s=document.currentScript;var e=new CustomEvent('${beforeScriptExecuteEvent}',{detail:{s:s}});window.dispatchEvent(e);})();`;

            const codeFactory = beforeExecutedListenerScript + classicScriptTransformer!(code, src);

            if (syncMode) {
              // if it's a sync script and there is a previous sync script(mainly there are multiple defer scripts), we should wait it until loaded to consistent with the browser behavior
              if (prevScriptTranspiledDeferred && !prevScriptTranspiledDeferred.isSettled()) {
                await waitUntilSettled(prevScriptTranspiledDeferred.promise);
              }
              scope.controller.signal.throwIfAborted();

              // HTMLScriptElement default fetchPriority is 'auto', we should set it to 'high' to make it execute earlier while it's not async script
              script.fetchPriority = 'high';
            }

            // change the script src to the blob url to make it executed in the sandbox
            blobUrl = URL.createObjectURL(new Blob([codeFactory], { type: 'text/javascript' }));
            beforeExecutedListener = (evt) => {
              if (scope.controller.signal.aborted) return;
              const { s } = (evt as CustomEvent<{ s: HTMLScriptElement }>).detail;
              if (s === script) {
                releaseExecutionResources();
                // change the script src to the original src while the script is executing
                // thus the script behavior can be more consistent with the native browser logic
                s.src = src;
                s.dataset.consumed = 'true';
                delete s.dataset.src;
              }
            };
            window.addEventListener(beforeScriptExecuteEvent, beforeExecutedListener);
            script.src = blobUrl;

            scriptTranspiledDeferred?.resolve();
          })
          .catch((e) => {
            releaseExecutionResources();
            scriptTranspiledDeferred?.reject(e);
            if (scope.controller.signal.aborted) return;
            // the blob src will never be set, so the element can never fire load/error on its
            // own — dispatch the error event manually to match the native failed-script
            // semantics (the streaming walk blocks on this script and the entry bookkeeping
            // listens for its completion, both must be released)
            script.dispatchEvent(new Event('error'));
          });

        return script;
      }

      case Mode.INLINE_CODE_IN_SANDBOX: {
        const { code } = result;
        script.textContent = classicScriptTransformer!(code);
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
        script.src = getScopedReusingObjectUrl(owner, src, url, 'text/javascript');
        const cancelScript = () => {
          script.onload = script.onerror = null;
          script.remove();
          script.removeAttribute('src');
        };
        scope.cleanups.add(cancelScript);

        const onScriptComplete = (
          prevListener: typeof HTMLScriptElement.prototype.onload | typeof HTMLScriptElement.prototype.onerror,
          event: Event,
        ) => {
          script.onload = script.onerror = null;
          scope.cleanups.delete(cancelScript);
          if (scope.controller.signal.aborted) return;

          script.src = src;
          script.dataset.consumed = 'true';
          script.dataset.src = url;

          prevListener?.call(script, event);
        };
        script.onload = onScriptComplete.bind(null, script.onload);
        script.onerror = onScriptComplete.bind(null, script.onerror) as typeof HTMLScriptElement.prototype.onerror;

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
