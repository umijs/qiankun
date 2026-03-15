import { describe, expect, it, vi } from 'vitest';
import { transpileStyleText, transpileStyleRule } from '../style';
import type { StyleTranspilerOpts } from '../style';

const defaultOpts: StyleTranspilerOpts = {
  appName: 'test-app',
  scopeRoot: '[data-name="test-app"]',
  fetch: window.fetch,
};

describe('transpileStyleText', () => {
  describe('@scope wrapping', () => {
    it('wraps basic CSS rules in @scope', async () => {
      const input = '.container { color: red; }';
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toContain('@scope ([data-name="test-app"])');
      expect(result).toContain('.container { color: red; }');
    });

    it('wraps multiple rules in a single @scope block', async () => {
      const input = '.a { color: red; }\n.b { color: blue; }';
      const result = await transpileStyleText(input, defaultOpts);
      const scopeMatches = result.match(/@scope/g);
      expect(scopeMatches).toHaveLength(1);
      expect(result).toContain('.a { color: red; }');
      expect(result).toContain('.b { color: blue; }');
    });

    it('preserves nested @media rules inside @scope', async () => {
      const input = '@media (max-width: 768px) { .a { color: red; } }';
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toContain('@scope ([data-name="test-app"])');
      expect(result).toContain('@media (max-width: 768px)');
      expect(result).toContain('.a { color: red; }');
    });

    it('preserves nested @supports rules inside @scope', async () => {
      const input = '@supports (display: grid) { .grid { display: grid; } }';
      const result = await transpileStyleText(input, defaultOpts);
      expect(result).toContain('@scope ([data-name="test-app"])');
      expect(result).toContain('@supports (display: grid)');
    });

    it('handles empty CSS input without error', async () => {
      const result = await transpileStyleText('', defaultOpts);
      expect(result).toBe('');
    });

    it('handles whitespace-only CSS input', async () => {
      const result = await transpileStyleText('   \n\t  ', defaultOpts);
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
  it('wraps a regular rule in @scope', () => {
    const result = transpileStyleRule('.foo { color: red; }', ruleOpts);
    expect(result).toBe('@scope ([data-name="test-app"]) { .foo { color: red; } }');
  });

  it('returns empty string for empty input', () => {
    expect(transpileStyleRule('', ruleOpts)).toBe('');
    expect(transpileStyleRule('   ', ruleOpts)).toBe('');
  });

  it('returns @font-face as-is without wrapping', () => {
    const input = '@font-face { font-family: "MyFont"; src: url("/f.woff2"); }';
    expect(transpileStyleRule(input, ruleOpts)).toBe(input);
  });

  it('returns @namespace as-is without wrapping', () => {
    const input = '@namespace svg "http://www.w3.org/2000/svg";';
    expect(transpileStyleRule(input, ruleOpts)).toBe(input);
  });

  it('prefixes @keyframes name and wraps in @scope', () => {
    const input = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
    const result = transpileStyleRule(input, ruleOpts);
    expect(result).toContain('@keyframes __qk_test-app_fadeIn');
    expect(result).toMatch(/^@scope \(\[data-name="test-app"\]\)/);
  });

  it('skips already-scoped rules to prevent double-wrapping', () => {
    const alreadyScoped = '@scope ([data-name="test-app"]) { .foo { color: red; } }';
    expect(transpileStyleRule(alreadyScoped, ruleOpts)).toBe(alreadyScoped);
  });

  it('wraps @media rules in @scope', () => {
    const input = '@media (max-width: 768px) { .a { color: red; } }';
    const result = transpileStyleRule(input, ruleOpts);
    expect(result).toContain('@scope ([data-name="test-app"])');
    expect(result).toContain('@media (max-width: 768px)');
  });

  it('wraps @supports rules in @scope', () => {
    const input = '@supports (display: grid) { .grid { display: grid; } }';
    const result = transpileStyleRule(input, ruleOpts);
    expect(result).toContain('@scope ([data-name="test-app"])');
    expect(result).toContain('@supports (display: grid)');
  });
});
