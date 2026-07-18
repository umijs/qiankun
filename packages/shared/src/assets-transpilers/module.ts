/**
 * @author Kuitos
 * @since 2026-07-04
 * DOM-level entry of the ESM transpiler pipeline (RFC §9/§12):
 * `<script type="module">` elements are neutralized in place and their execution is taken over by
 * the Compartment module facade (evaluated in document order once the HTML stream ends),
 * since a module script with a src attribute would immediately trigger the native loader and bypass
 * the sandbox completely.
 */
import type { CompartmentModuleFacade } from '../esm-sandbox';
import { resolveUrl } from '../utils';
import type { ScriptTranspilerOpts } from './types';

const consumedImportMapType = 'qiankun-importmap';

// mirror the classic remote-script credentials mapping (script.ts) so cross-origin module fetches
// preserve cookies for `crossorigin=use-credentials` sub apps (RFC §8)
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

export function transpileModuleScript(
  script: HTMLScriptElement,
  baseURI: string,
  compartment: CompartmentModuleFacade,
  opts: ScriptTranspilerOpts,
): HTMLScriptElement {
  const { scriptTranspiledDeferred } = opts;
  const srcAttribute = script.getAttribute('src');

  if (srcAttribute) {
    const entireUrl = resolveUrl(srcAttribute, baseURI);
    // remove the src to prevent the native module loader from fetching and executing the original URL
    script.removeAttribute('src');
    script.dataset.src = entireUrl;
    script.dataset.esm = 'true';

    compartment.registerDocumentModule({
      url: entireUrl,
      baseUrl: baseURI,
      isEntry: script.hasAttribute('entry'),
      credentials: getCredentials(script.crossOrigin),
    });

    // module scripts never join the classic defer script chain, they are implicitly deferred
    scriptTranspiledDeferred?.resolve();
    return script;
  }

  const code = script.textContent;
  if (code) {
    // inline module (second walk pass with the grafted text): take the code over and leave a
    // harmless comment behind, the live script element executes it as an inert module
    script.textContent = '/* qiankun: inline module consumed, executed via the ESM sandbox pipeline */';
    script.dataset.esm = 'true';
    script.dataset.consumed = 'true';

    compartment.registerDocumentModule({
      code,
      baseUrl: baseURI,
      credentials: getCredentials(script.crossOrigin),
    });

    scriptTranspiledDeferred?.resolve();
    return script;
  }

  // first walk pass of an inline module host: the text arrives with a later pass, nothing to do yet
  return script;
}

export function consumeImportMapScript(
  script: HTMLScriptElement,
  baseURI: string,
  compartment: CompartmentModuleFacade,
): HTMLScriptElement {
  // idempotent: writable-dom re-transforms inline hosts, so a re-visit must not re-parse the leftover
  // comment (which would throw a spurious '[qiankun] failed to parse the import map')
  if (script.dataset.consumed === 'true') {
    return script;
  }

  const mapText = script.text;
  if (mapText.trim()) {
    // qiankun parses the sub app import map itself, it must never reach the host document (RFC §5)
    compartment.registerImportMap(mapText, baseURI);
    script.textContent = '/* qiankun: importmap consumed */';
    script.dataset.consumed = 'true';
  }

  // neutralize the type so the browser never merges this map into the document import map
  script.type = consumedImportMapType;
  return script;
}

export const isImportMapScriptType = (type: string): boolean => type === 'importmap' || type === consumedImportMapType;
