/**
 * @author Kuitos
 * @since 2026-03-15
 */

import { warn } from '../reporter';

export type StyleTranspilerOpts = {
  appName: string;
  scopeRoot: string;
  fetch: typeof globalThis.fetch;
  /** Base URL of the stylesheet, used to resolve relative url() and @import paths */
  baseURL?: string;
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

const ANIMATION_NAME_DECL_RE = /(animation-name\s*:\s*)([^;}]+)/g;
// Matches `animation:` shorthand only, not `animation-*` longhand properties.
const ANIMATION_SHORTHAND_DECL_RE = /(animation\s*:\s*)([^;}]+)/g;
const IDENT_TOKEN_RE = /([\w-]+)/g;

function rewriteAnimationValueTokens(value: string, nameMap: Map<string, string>): string {
  return value
    .split(',')
    .map((entry) => entry.replace(IDENT_TOKEN_RE, (token) => nameMap.get(token) ?? token))
    .join(',');
}

function prefixKeyframes(cssText: string, appName: string): string {
  const prefix = `${QIANKUN_KEYFRAMES_PREFIX}${appName}_`;
  const nameMap = new Map<string, string>();

  let result = cssText.replace(KEYFRAMES_RE, (_match, name: string) => {
    if (name.startsWith(prefix)) {
      return _match;
    }
    nameMap.set(name, `${prefix}${name}`);
    return `@keyframes ${prefix}${name}`;
  });

  if (nameMap.size === 0) {
    return result;
  }

  result = result.replace(ANIMATION_NAME_DECL_RE, (_match, head: string, value: string) => {
    return `${head}${rewriteAnimationValueTokens(value, nameMap)}`;
  });

  result = result.replace(ANIMATION_SHORTHAND_DECL_RE, (match, head: string, value: string) => {
    // Guard: the RE also matches `animation-name:`, `animation-duration:` etc.; only rewrite the shorthand form.
    if (/^animation-[a-z]/i.test(match)) return match;
    return `${head}${rewriteAnimationValueTokens(value, nameMap)}`;
  });

  return result;
}

const CSS_URL_RE = /url\(\s*["']?(?!(?:data|blob|https?):)([^"')]+)["']?\s*\)/g;

function resolveRelativeCSSUrls(cssText: string, baseURL: string): string {
  return cssText.replace(CSS_URL_RE, (match, relativePath: string) => {
    try {
      const absoluteUrl = new URL(relativePath, baseURL).toString();
      return `url("${absoluteUrl}")`;
    } catch {
      return match;
    }
  });
}

function resolveImportUrl(url: string, baseURL?: string): string {
  if (!baseURL || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }
  try {
    return new URL(url, baseURL).toString();
  } catch {
    return url;
  }
}

async function inlineImports(
  cssText: string,
  fetchFn: typeof globalThis.fetch,
  baseURL?: string,
  visited: Set<string> = new Set(),
): Promise<string> {
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
    const resolvedUrl = resolveImportUrl(url, baseURL);

    if (visited.has(resolvedUrl)) {
      warn(`Duplicate @import detected for "${resolvedUrl}", skipping.`);
      result = result.replace(fullMatch, '');
      continue;
    }

    try {
      visited.add(resolvedUrl);
      const res = await fetchFn(resolvedUrl);
      let importedCSS = await res.text();
      importedCSS = resolveRelativeCSSUrls(importedCSS, resolvedUrl);
      importedCSS = await inlineImports(importedCSS, fetchFn, resolvedUrl, visited);
      result = result.replace(fullMatch, importedCSS);
    } catch {
      warn(`Failed to fetch @import "${resolvedUrl}", leaving as-is. This may be due to CORS restrictions.`);
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

  const resolved = opts.baseURL ? resolveRelativeCSSUrls(trimmed, opts.baseURL) : trimmed;
  return transpileStyleTextSync(resolved, opts);
}

async function transpileStyleTextAsync(cssText: string, opts: StyleTranspilerOpts): Promise<string> {
  const visited = new Set<string>();
  if (opts.baseURL) visited.add(opts.baseURL);
  const inlined = await inlineImports(cssText, opts.fetch, opts.baseURL, visited);
  const resolved = opts.baseURL ? resolveRelativeCSSUrls(inlined, opts.baseURL) : inlined;
  return transpileStyleTextSync(resolved, opts);
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
    // Clear synchronously so the unscoped source cannot apply globally during the fetch window.
    style.textContent = '';
    void result.then((transformed) => {
      style.textContent = transformed;
    });
  }

  return style;
}
