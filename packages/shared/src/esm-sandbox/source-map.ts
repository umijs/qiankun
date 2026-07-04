/**
 * @author Kuitos
 * @since 2026-07-04
 * Keep the pre-existing sourceMappingURL of a rewritten module meaningful (RFC §15):
 * - inline data: maps get their line mappings shifted by the injected header lines and their sources absolutized
 * - external map URLs are stripped in v1, a shifted-but-kept map would be more misleading than none
 */

type RawSourceMap = {
  version: number;
  sources?: Array<string | null>;
  sourceRoot?: string;
  mappings?: string;
  [key: string]: unknown;
};

const decodeBase64 = (input: string): string => {
  if (typeof atob === 'function') {
    // atob returns a binary string; decode it as UTF-8 in one native pass (dev source maps can be large)
    const binary = atob(input);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  const nodeBuffer = (globalThis as { Buffer?: { from(i: string, e: string): { toString(e: string): string } } })
    .Buffer;
  return nodeBuffer!.from(input, 'base64').toString('utf-8');
};

const encodeBase64 = (input: string): string => {
  if (typeof btoa === 'function') {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    // chunk to keep String.fromCharCode.apply within the argument-count limit
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
    }
    return btoa(binary);
  }
  const nodeBuffer = (globalThis as { Buffer?: { from(i: string, e: string): { toString(e: string): string } } })
    .Buffer;
  return nodeBuffer!.from(input, 'utf-8').toString('base64');
};

const absolutizeSource = (source: string | null, sourceRoot: string | undefined, baseUrl: string): string | null => {
  if (!source) return source;
  const joined = `${sourceRoot ?? ''}${source}`;
  try {
    return new URL(joined, baseUrl).href;
  } catch {
    // sources with custom schemes like webpack:// are kept as is
    return joined;
  }
};

const inlineMapPattern = /^data:application\/json(?:;charset=[^;,]+)?(;base64)?,([\s\S]*)$/;

const remapInlineMap = (dataUrl: string, moduleUrl: string, injectedLines: number): string | undefined => {
  const match = inlineMapPattern.exec(dataUrl);
  if (!match) return undefined;

  const [, base64Flag, payload] = match;
  try {
    const json = base64Flag ? decodeBase64(payload) : decodeURIComponent(payload);
    const map = JSON.parse(json) as RawSourceMap;

    // every leading `;` represents one generated line in the source map spec
    map.mappings = ';'.repeat(injectedLines) + (map.mappings ?? '');
    if (map.sources) {
      const { sourceRoot } = map;
      map.sources = map.sources.map((source) => absolutizeSource(source, sourceRoot, moduleUrl));
      delete map.sourceRoot;
    }

    return `data:application/json;base64,${encodeBase64(JSON.stringify(map))}`;
  } catch {
    return undefined;
  }
};

/**
 * Rewrite the trailing sourceMappingURL comment of the transpiled module code.
 */
export function remapSourceMappingUrl(code: string, moduleUrl: string, injectedLines: number): string {
  const pattern = /^[ \t]*\/\/[#@][ \t]*sourceMappingURL=(\S+)[ \t]*$/gm;

  let match: RegExpExecArray | null;
  let last: RegExpExecArray | null = null;
  while ((match = pattern.exec(code))) {
    last = match;
  }
  if (!last) return code;

  const url = last[1];
  const commentStart = last.index;
  const commentEnd = last.index + last[0].length;
  const replaceComment = (replacement: string): string =>
    code.slice(0, commentStart) + replacement + code.slice(commentEnd);

  if (url.startsWith('data:')) {
    const remapped = remapInlineMap(url, moduleUrl, injectedLines);
    return remapped ? replaceComment(`//# sourceMappingURL=${remapped}`) : replaceComment('');
  }

  // external map: line offsets cannot be merged without fetching it, strip to avoid misleading mappings
  return replaceComment('');
}
