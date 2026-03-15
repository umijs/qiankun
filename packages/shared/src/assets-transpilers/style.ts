/**
 * @author Kuitos
 * @since 2026-03-15
 */

export type StyleTranspilerOpts = {
  appName: string;
  scopeRoot: string;
  fetch: typeof globalThis.fetch;
};

const KEYFRAMES_RE = /@keyframes\s+([\w-]+)/g;
const FONT_FACE_RE = /@font-face\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g;
const NAMESPACE_RE = /@namespace\s+[^;]+;/g;
const IMPORT_URL_RE = /@import\s+url\(\s*["']?([^"')]+)["']?\s*\)\s*;?/g;
const IMPORT_STRING_RE = /@import\s+["']([^"']+)["']\s*;?/g;

const QIANKUN_KEYFRAMES_PREFIX = '__qk_';

function extractAtRules(cssText: string, regex: RegExp): { extracted: string[]; remaining: string } {
  const extracted: string[] = [];
  const remaining = cssText.replace(regex, (match) => {
    extracted.push(match);
    return '';
  });
  return { extracted, remaining };
}

function prefixKeyframes(cssText: string, appName: string): string {
  const keyframeNames: string[] = [];
  const prefix = `${QIANKUN_KEYFRAMES_PREFIX}${appName}_`;

  let result = cssText.replace(KEYFRAMES_RE, (_match, name: string) => {
    if (name.startsWith(prefix)) {
      return _match;
    }
    keyframeNames.push(name);
    return `@keyframes ${prefix}${name}`;
  });

  for (const name of keyframeNames) {
    const prefixed = `${prefix}${name}`;
    const animNameRe = new RegExp(`(animation-name\\s*:\\s*)${escapeRegExp(name)}`, 'g');
    result = result.replace(animNameRe, `$1${prefixed}`);

    const animShorthandRe = new RegExp(`(animation\\s*:[^;]*?)\\b${escapeRegExp(name)}\\b`, 'g');
    result = result.replace(animShorthandRe, `$1${prefixed}`);
  }

  return result;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function inlineImports(cssText: string, fetchFn: typeof globalThis.fetch): Promise<string> {
  const imports: Array<{ fullMatch: string; url: string }> = [];

  const urlRe = new RegExp(IMPORT_URL_RE.source, 'g');
  for (let match = urlRe.exec(cssText); match !== null; match = urlRe.exec(cssText)) {
    imports.push({ fullMatch: match[0], url: match[1] });
  }

  const strRe = new RegExp(IMPORT_STRING_RE.source, 'g');
  for (let match = strRe.exec(cssText); match !== null; match = strRe.exec(cssText)) {
    if (!imports.some((i) => i.url === match[1])) {
      imports.push({ fullMatch: match[0], url: match[1] });
    }
  }

  let result = cssText;
  for (const { fullMatch, url } of imports) {
    try {
      const res = await fetchFn(url);
      let importedCSS = await res.text();
      importedCSS = await inlineImports(importedCSS, fetchFn);
      result = result.replace(fullMatch, importedCSS);
    } catch {
      console.warn(`[qiankun] Failed to fetch @import "${url}", leaving as-is. This may be due to CORS restrictions.`);
    }
  }

  return result;
}

export function transpileStyleText(cssText: string, opts: StyleTranspilerOpts): string | Promise<string> {
  const trimmed = cssText.trim();
  if (!trimmed) return '';

  const hasImports = IMPORT_URL_RE.test(trimmed) || IMPORT_STRING_RE.test(trimmed);
  IMPORT_URL_RE.lastIndex = 0;
  IMPORT_STRING_RE.lastIndex = 0;

  if (hasImports) {
    return transpileStyleTextAsync(trimmed, opts);
  }

  return transpileStyleTextSync(trimmed, opts);
}

async function transpileStyleTextAsync(cssText: string, opts: StyleTranspilerOpts): Promise<string> {
  const inlined = await inlineImports(cssText, opts.fetch);
  return transpileStyleTextSync(inlined, opts);
}

function transpileStyleTextSync(cssText: string, opts: StyleTranspilerOpts): string {
  const { appName, scopeRoot } = opts;

  const { extracted: fontFaces, remaining: afterFontFace } = extractAtRules(cssText, FONT_FACE_RE);
  const { extracted: namespaces, remaining: afterNamespace } = extractAtRules(afterFontFace, NAMESPACE_RE);

  let scopedContent = prefixKeyframes(afterNamespace, appName);
  scopedContent = scopedContent.trim();

  const hoisted = [...namespaces, ...fontFaces].join('\n');

  if (!scopedContent) {
    return hoisted.trim();
  }

  const scoped = `@scope (${scopeRoot}) {\n${scopedContent}\n}`;

  return hoisted ? `${hoisted}\n${scoped}` : scoped;
}

/**
 * Transpile a single CSS rule text for CSSOM-level interception (e.g. CSSStyleSheet.insertRule).
 * This is synchronous since individual rules never contain @import.
 * Rules that must remain global (@font-face, @namespace) are returned as-is.
 * All other rules are wrapped with @scope for isolation.
 */
export function transpileStyleRule(ruleText: string, opts: Pick<StyleTranspilerOpts, 'appName' | 'scopeRoot'>): string {
  const trimmed = ruleText.trim();
  if (!trimmed) return '';

  // Already scoped — skip to avoid double-wrapping during rebuild
  if (trimmed.startsWith(`@scope (${opts.scopeRoot})`)) {
    return trimmed;
  }

  // @font-face must remain global — scoping it breaks font loading
  if (FONT_FACE_RE.test(trimmed)) {
    FONT_FACE_RE.lastIndex = 0;
    return trimmed;
  }

  // @namespace must remain global
  if (NAMESPACE_RE.test(trimmed)) {
    NAMESPACE_RE.lastIndex = 0;
    return trimmed;
  }

  const prefixed = prefixKeyframes(trimmed, opts.appName);
  return `@scope (${opts.scopeRoot}) { ${prefixed} }`;
}

export default function transpileStyle(
  style: HTMLStyleElement,
  _baseURI: string,
  opts: StyleTranspilerOpts,
): HTMLStyleElement {
  const cssText = style.textContent;
  if (!cssText) return style;

  const result = transpileStyleText(cssText, opts);
  if (typeof result === 'string') {
    style.textContent = result;
  } else {
    void result.then((transformed) => {
      style.textContent = transformed;
    });
  }

  return style;
}
