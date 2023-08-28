/**
 * @author Kuitos
 * @since 2023-03-16
 */

import type { MatchResult } from '../module-resolver';
import { getEntireUrl } from '../utils';
import type { AssetsTranspilerOpts } from './types';

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
  | { mode: 'remote'; result: { src: string } }
  | { mode: 'cache'; result: { src: string } & MatchResult }
  | { mode: 'inline'; result: { code: string } }
  | { mode: 'none'; result?: never };

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
          mode: 'cache',
          result: { src: entireUrl, ...matchedScript },
        };
      }

      return {
        mode: 'remote',
        result: { src: entireUrl },
      };
    }

    if (isValidJavaScriptType(type)) {
      const rawNode = opts.rawNode as HTMLScriptElement;
      const scriptNode = script.textContent ? script : rawNode.childNodes[0];

      const code = scriptNode.textContent;
      if (code) {
        return {
          mode: 'inline',
          result: {
            code,
          },
        };
      }
    }
  }

  return { mode: 'none' };
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
    case 'remote': {
      const { src } = result;

      // We must remove script src to avoid self execution as we need to fetch the script content and transpile it
      script.removeAttribute('src');
      script.dataset.src = src;

      const syncMode = !script.getAttribute('async');
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

    case 'inline': {
      const rawNode = opts.rawNode as HTMLScriptElement;
      const scriptNode = script.textContent ? script : rawNode.childNodes[0];
      const { code } = result;

      scriptNode.textContent = sandbox!.makeEvaluateFactory(code, baseURI);
      // mark the script have consumed
      script.dataset.consumed = 'true';

      return script;
    }

    case 'cache': {
      const { url, version, src } = result;

      script.dataset.src = src;
      script.dataset.version = version;

      const syncMode = !script.getAttribute('async');
      // HTMLScriptElement default fetchPriority is 'auto', we should set it to 'high' to make it execute earlier while it's not async script
      if (syncMode) {
        script.fetchPriority = 'high';
      }

      // When the script hits the dependency reuse logic, the current script is not executed, and an empty script is returned directly
      script.src = URL.createObjectURL(
        new Blob([`// ${src} is reusing the execution result of ${url}`], {
          type: 'text/javascript',
        }),
      );

      return script;
    }

    case 'none':
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
