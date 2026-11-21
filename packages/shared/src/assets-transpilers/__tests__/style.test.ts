import { describe, expect, it, vi } from 'vitest';
import transpileStyle, { transpileStyleText, transpileStyleRule } from '../style';
import type { StyleTranspilerOpts } from '../style';

const defaultOpts: StyleTranspilerOpts = {
  appName: 'test-app',
  scopeRoot: '[data-name="test-app"]',
  fetch: window.fetch,
};

describe('transpileStyleText', () => {
  describe('@scope wrapping', () => {
    it.each([
      ['basic rule', '.container { color: red; }'],
      ['@media rule', '@media (max-width: 768px) { .a { color: red; } }'],
      ['@supports rule', '@supports (display: grid) { .grid { display: grid; } }'],
    ])('wraps %s inside @scope', (_label, input) => {
      const result = transpileStyleText(input, defaultOpts);
      expect(result).toContain('@scope ([data-name="test-app"])');
      expect(result).toContain(input);
    });

    it('wraps multiple rules in a single @scope block', async () => {
      const input = '.a { color: red; }\n.b { color: blue; }';
      const result = await transpileStyleText(input, defaultOpts);
      const scopeMatches = result.match(/@scope/g);
      expect(scopeMatches).toHaveLength(1);
      expect(result).toContain('.a { color: red; }');
      expect(result).toContain('.b { color: blue; }');
    });

    it.each(['', '   \n\t  '])('returns empty string for empty/whitespace CSS (%j)', async (input) => {
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toBe('');
    });
  });

  describe('@keyframes prefixing', () => {
    it('prefixes @keyframes name and rewrites animation-name references', async () => {
      const input = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.element { animation-name: fadeIn; }`;
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toContain('@keyframes __qk_test-app_fadeIn');
      expect(result).toContain('animation-name: __qk_test-app_fadeIn');
      expect(result).not.toMatch(/animation-name:\s*fadeIn/);
    });

    it('rewrites animation shorthand references', async () => {
      const input = `
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
.box { animation: slide 1s ease-in-out; }`;
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toContain('@keyframes __qk_test-app_slide');
      expect(result).toContain('animation: __qk_test-app_slide 1s ease-in-out');
    });

    it('handles multiple @keyframes in same stylesheet', async () => {
      const input = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { top: 100px; } to { top: 0; } }
.a { animation-name: fadeIn; }
.b { animation-name: slideUp; }`;
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toContain('@keyframes __qk_test-app_fadeIn');
      expect(result).toContain('@keyframes __qk_test-app_slideUp');
      expect(result).toContain('animation-name: __qk_test-app_fadeIn');
      expect(result).toContain('animation-name: __qk_test-app_slideUp');
    });

    it('handles animation shorthand with multiple values (comma-separated)', async () => {
      const input = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { top: 100px; } to { top: 0; } }
.multi { animation: fadeIn 1s, slideUp 2s; }`;
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toContain('animation: __qk_test-app_fadeIn 1s, __qk_test-app_slideUp 2s');
    });

    it('rewrites every token in a multi-value animation-name list', async () => {
      const input = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { top: 100px; } to { top: 0; } }
.multi { animation-name: fadeIn, slideUp; }`;
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toContain('animation-name: __qk_test-app_fadeIn, __qk_test-app_slideUp');
      expect(result).not.toMatch(/animation-name:\s*__qk_test-app_fadeIn,\s*slideUp/);
    });

    it('does not rewrite animation-duration longhand values that look like identifiers', async () => {
      const input = `
@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
.x { animation-duration: 2s; animation-name: spin; }`;
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toContain('animation-duration: 2s');
      expect(result).toContain('animation-name: __qk_test-app_spin');
    });

    it('places prefixed @keyframes inside @scope', async () => {
      const input = `
@keyframes pulse { 0% { scale: 1; } 50% { scale: 1.1; } 100% { scale: 1; } }
.icon { animation: pulse 2s infinite; }`;
      const result = await transpileStyleText(input, defaultOpts);
      const scopeStart = result.indexOf('@scope');
      const keyframesPos = result.indexOf('@keyframes __qk_test-app_pulse');
      expect(scopeStart).toBeGreaterThanOrEqual(0);
      expect(keyframesPos).toBeGreaterThan(scopeStart);
    });
  });

  describe('@font-face hoisting', () => {
    it('hoists @font-face blocks outside @scope', async () => {
      const input = `
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
}
.text { font-family: 'MyFont'; }`;
      const result = await transpileStyleText(input, defaultOpts);
      const fontFacePos = result.indexOf('@font-face');
      const scopePos = result.indexOf('@scope');
      expect(fontFacePos).toBeGreaterThanOrEqual(0);
      expect(scopePos).toBeGreaterThan(fontFacePos);
    });

    it('hoists multiple @font-face blocks', async () => {
      const input = `
@font-face { font-family: 'FontA'; src: url('/a.woff2'); }
@font-face { font-family: 'FontB'; src: url('/b.woff2'); }
.a { font-family: 'FontA'; }`;
      const result = await transpileStyleText(input, defaultOpts);
      const fontFaceMatches = result.match(/@font-face/g);
      expect(fontFaceMatches).toHaveLength(2);
      const lastFontFaceEnd = result.lastIndexOf('@font-face');
      const scopePos = result.indexOf('@scope');
      expect(lastFontFaceEnd).toBeLessThan(scopePos);
    });
  });

  describe('@import inlining', () => {
    it('inlines @import rules by fetching and scoping the content', async () => {
      const importedCSS = '.imported { color: green; }';
      const mockFetch = vi.fn().mockResolvedValue(new Response(importedCSS));

      const input = `@import url("https://example.com/style.css");\n.local { color: red; }`;
      const result = await transpileStyleText(input, { ...defaultOpts, fetch: mockFetch });

      expect(mockFetch).toHaveBeenCalledWith('https://example.com/style.css');
      expect(result).toContain('.imported { color: green; }');
      expect(result).toContain('.local { color: red; }');
      expect(result).not.toContain('@import');
    });

    it('handles @import with string syntax (no url())', async () => {
      const importedCSS = '.external { margin: 0; }';
      const mockFetch = vi.fn().mockResolvedValue(new Response(importedCSS));

      const input = `@import "https://example.com/reset.css";\n.local { padding: 0; }`;
      const result = await transpileStyleText(input, { ...defaultOpts, fetch: mockFetch });

      expect(mockFetch).toHaveBeenCalledWith('https://example.com/reset.css');
      expect(result).toContain('.external { margin: 0; }');
      expect(result).not.toContain('@import');
    });

    it('leaves @import as-is with warning when fetch fails (CORS)', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const mockFetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

      const input = `@import url("https://cross-origin.com/style.css");\n.local { color: red; }`;
      const result = await transpileStyleText(input, { ...defaultOpts, fetch: mockFetch });

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toContain('@import url("https://cross-origin.com/style.css")');
      expect(result).toContain('.local { color: red; }');
      consoleSpy.mockRestore();
    });

    it('handles nested @import recursively', async () => {
      const innerCSS = '.inner { display: flex; }';
      const outerCSS = `@import url("https://example.com/inner.css");\n.outer { display: block; }`;

      const mockFetch = vi.fn().mockImplementation((url: string) => {
        if (url === 'https://example.com/outer.css') {
          return Promise.resolve(new Response(outerCSS));
        }
        if (url === 'https://example.com/inner.css') {
          return Promise.resolve(new Response(innerCSS));
        }
        return Promise.reject(new Error('Not found'));
      });

      const input = `@import url("https://example.com/outer.css");\n.root { color: black; }`;
      const result = await transpileStyleText(input, { ...defaultOpts, fetch: mockFetch });

      expect(result).toContain('.inner { display: flex; }');
      expect(result).toContain('.outer { display: block; }');
      expect(result).toContain('.root { color: black; }');
      expect(result).not.toContain('@import');
    });

    it('detects circular @import and skips them', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const cssA = `@import url("https://example.com/b.css");\n.a { color: red; }`;
      const cssB = `@import url("https://example.com/a.css");\n.b { color: blue; }`;

      const mockFetch = vi.fn().mockImplementation((url: string) => {
        if (url === 'https://example.com/a.css') return Promise.resolve(new Response(cssA));
        if (url === 'https://example.com/b.css') return Promise.resolve(new Response(cssB));
        return Promise.reject(new Error('Not found'));
      });

      const input = `@import url("https://example.com/a.css");\n.root { margin: 0; }`;
      const result = await transpileStyleText(input, { ...defaultOpts, fetch: mockFetch });

      expect(result).toContain('.a { color: red; }');
      expect(result).toContain('.b { color: blue; }');
      expect(result).toContain('.root { margin: 0; }');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Duplicate @import'));
      consoleSpy.mockRestore();
    });

    it('detects a top-level self-import without fetching the same URL twice', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const selfUrl = 'https://example.com/self.css';
      const cssSelf = `@import url("${selfUrl}");\n.self { color: red; }`;

      const mockFetch = vi.fn().mockImplementation((url: string) => {
        if (url === selfUrl) return Promise.resolve(new Response(cssSelf));
        return Promise.reject(new Error('Not found'));
      });

      await transpileStyleText(cssSelf, {
        ...defaultOpts,
        fetch: mockFetch,
        baseURL: selfUrl,
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Duplicate @import'));
      consoleSpy.mockRestore();
    });

    it('resolves relative @import URLs against baseURL', async () => {
      const importedCSS = '.sub { display: block; }';
      const mockFetch = vi.fn().mockResolvedValue(new Response(importedCSS));

      const input = `@import url("./sub/reset.css");\n.main { padding: 0; }`;
      const result = await transpileStyleText(input, {
        ...defaultOpts,
        fetch: mockFetch,
        baseURL: 'https://cdn.example.com/styles/main.css',
      });

      expect(mockFetch).toHaveBeenCalledWith('https://cdn.example.com/styles/sub/reset.css');
      expect(result).toContain('.sub { display: block; }');
      expect(result).not.toContain('@import');
    });
  });

  describe('relative url() resolution', () => {
    it('rewrites relative url() paths when baseURL is provided', async () => {
      const input = `.bg { background: url("../images/hero.png"); }`;
      const result = await transpileStyleText(input, {
        ...defaultOpts,
        baseURL: 'https://cdn.example.com/styles/main.css',
      });

      expect(result).toContain('url("https://cdn.example.com/images/hero.png")');
    });

    it('does not rewrite absolute url() paths', async () => {
      const input = `.bg { background: url("https://cdn.example.com/images/hero.png"); }`;
      const result = await transpileStyleText(input, {
        ...defaultOpts,
        baseURL: 'https://other.example.com/styles/main.css',
      });

      expect(result).toContain('url("https://cdn.example.com/images/hero.png")');
    });

    it('does not rewrite data: or blob: URLs', async () => {
      const input = `.icon { background: url("data:image/svg+xml,..."); }`;
      const result = await transpileStyleText(input, {
        ...defaultOpts,
        baseURL: 'https://cdn.example.com/styles/main.css',
      });

      expect(result).toContain('data:image/svg+xml,...');
    });

    it('does not rewrite url() when baseURL is not provided', async () => {
      const input = `.bg { background: url("../images/hero.png"); }`;
      const result = await transpileStyleText(input, defaultOpts);

      expect(result).toContain('url("../images/hero.png")');
    });

    it('resolves relative url() inside imported CSS against the import source URL', async () => {
      const importedCSS = `.icon { background: url("./icons/check.svg"); }`;
      const mockFetch = vi.fn().mockResolvedValue(new Response(importedCSS));

      const input = `@import url("https://cdn.example.com/lib/components.css");\n.local { color: red; }`;
      const result = await transpileStyleText(input, { ...defaultOpts, fetch: mockFetch });

      expect(result).toContain('url("https://cdn.example.com/lib/icons/check.svg")');
    });
  });

  describe('@namespace handling', () => {
    it('hoists @namespace outside @scope', async () => {
      const input = `@namespace svg "http://www.w3.org/2000/svg";\nsvg|rect { fill: red; }`;
      const result = await transpileStyleText(input, defaultOpts);
      const nsPos = result.indexOf('@namespace');
      const scopePos = result.indexOf('@scope');
      expect(nsPos).toBeGreaterThanOrEqual(0);
      expect(nsPos).toBeLessThan(scopePos);
    });
  });

  describe('edge cases', () => {
    it('handles CSS with only @font-face (no regular rules)', async () => {
      const input = `@font-face { font-family: 'Solo'; src: url('/solo.woff2'); }`;
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toContain('@font-face');
    });

    it('handles CSS with only @keyframes and animation rules', async () => {
      const input = `
@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
.spinner { animation: spin 1s linear infinite; }`;
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toContain('@keyframes __qk_test-app_spin');
      expect(result).toContain('animation: __qk_test-app_spin 1s linear infinite');
      expect(result).toContain('@scope');
    });

    it('does not double-prefix already-prefixed keyframes', async () => {
      const input = `
@keyframes __qk_test-app_existing { from { opacity: 0; } to { opacity: 1; } }
.el { animation-name: __qk_test-app_existing; }`;
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).not.toContain('__qk_test-app___qk_test-app_');
    });

    it('uses correct scope root from opts', async () => {
      const customOpts = { ...defaultOpts, scopeRoot: '[data-name="custom-app"]' };
      const input = '.x { color: red; }';
      const result = await transpileStyleText(input, customOpts);
      expect(result).toContain('@scope ([data-name="custom-app"])');
    });
  });
});

const ruleOpts = { appName: 'test-app', scopeRoot: '[data-name="test-app"]' };

describe('transpileStyleRule', () => {
  it.each([
    ['regular rule', '.foo { color: red; }'],
    ['@media rule', '@media (max-width: 768px) { .a { color: red; } }'],
    ['@supports rule', '@supports (display: grid) { .grid { display: grid; } }'],
  ])('wraps %s in @scope', (_label, input) => {
    expect(transpileStyleRule(input, ruleOpts)).toBe(`@scope ([data-name="test-app"]) { ${input} }`);
  });

  it.each(['', '   '])('returns empty string for empty input (%j)', (input) => {
    expect(transpileStyleRule(input, ruleOpts)).toBe('');
  });

  it.each([
    ['@font-face', '@font-face { font-family: "MyFont"; src: url("/f.woff2"); }'],
    ['@namespace', '@namespace svg "http://www.w3.org/2000/svg";'],
    ['already-scoped', '@scope ([data-name="test-app"]) { .foo { color: red; } }'],
  ])('returns %s rule as-is without double-wrapping', (_label, input) => {
    expect(transpileStyleRule(input, ruleOpts)).toBe(input);
  });

  it('prefixes @keyframes name and wraps in @scope', () => {
    const input = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
    const result = transpileStyleRule(input, ruleOpts);
    expect(result).toContain('@keyframes __qk_test-app_fadeIn');
    expect(result).toMatch(/^@scope \(\[data-name="test-app"\]\)/);
  });
});

describe('transpileStyle (default export)', () => {
  it('synchronously clears inline <style> textContent before async @import inlining completes', async () => {
    const importedCSS = '.imported { color: green; }';
    let resolveFetch: (response: Response) => void = () => {};
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    const mockFetch = vi.fn().mockReturnValue(fetchPromise);

    const style = document.createElement('style');
    style.textContent = `@import url("https://example.com/imported.css");\n.local { color: red; }`;

    transpileStyle(style, 'http://localhost/', { ...defaultOpts, fetch: mockFetch });

    // Synchronously after the call, the original un-scoped CSS MUST already be gone,
    // otherwise the browser would briefly apply `.local { color: red; }` globally.
    expect(style.textContent).toBe('');

    resolveFetch(new Response(importedCSS));

    await vi.waitFor(() => {
      expect(style.textContent).toBeTruthy();
    });

    expect(style.textContent).toContain('@scope ([data-name="test-app"])');
    expect(style.textContent).toContain('.local { color: red; }');
    expect(style.textContent).not.toContain('@import');
  });

  it('synchronously writes scoped textContent when no @import is present', () => {
    const style = document.createElement('style');
    style.textContent = '.foo { color: red; }';

    transpileStyle(style, 'http://localhost/', defaultOpts);

    expect(style.textContent).toContain('@scope ([data-name="test-app"])');
    expect(style.textContent).toContain('.foo { color: red; }');
  });

  it('resolves relative @import URLs against baseURI when opts.baseURL is omitted', async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response('.rel { color: green; }'));
    const style = document.createElement('style');
    style.textContent = '@import url("./imported.css");';

    transpileStyle(style, 'https://sub.example/nested/entry.html', { ...defaultOpts, fetch: mockFetch });

    await vi.waitFor(() => {
      expect(style.textContent).toContain('.rel { color: green; }');
    });
    expect(mockFetch).toHaveBeenCalledWith('https://sub.example/nested/imported.css');
  });

  it('prefers explicit opts.baseURL over baseURI when resolving @import URLs', async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response('.explicit { color: blue; }'));
    const style = document.createElement('style');
    style.textContent = '@import url("./imported.css");';

    transpileStyle(style, 'https://fallback.example/entry.html', {
      ...defaultOpts,
      baseURL: 'https://explicit.example/sub/app.html',
      fetch: mockFetch,
    });

    await vi.waitFor(() => {
      expect(style.textContent).toContain('.explicit { color: blue; }');
    });
    expect(mockFetch).toHaveBeenCalledWith('https://explicit.example/sub/imported.css');
  });
});
