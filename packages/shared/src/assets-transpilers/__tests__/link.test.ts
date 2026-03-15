import { describe, expect, it, vi } from 'vitest';
import transpileLink from '../link';
import type { AssetsTranspilerOpts } from '../types';

const baseURI = 'http://localhost:8000/';

const makeOpts = (overrides?: Partial<AssetsTranspilerOpts>): AssetsTranspilerOpts => ({
  fetch: window.fetch,
  ...overrides,
});

describe('transpileLink', () => {
  describe('without styleIsolation', () => {
    it('returns the original link element with resolved href', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/main.css');

      const result = transpileLink(link, baseURI, makeOpts());
      expect(result).toBe(link);
      expect(result.tagName).toBe('LINK');
      expect((result as HTMLLinkElement).href).toBe('http://localhost:8000/styles/main.css');
    });

    it('returns the original link element when href is absent', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';

      const result = transpileLink(link, baseURI, makeOpts());
      expect(result).toBe(link);
    });
  });

  describe('with styleIsolation', () => {
    const styleIsolation = {
      appName: 'test-app',
      scopeRoot: '[data-name="test-app"]',
    };

    it('returns a <style> element instead of <link> for stylesheet links', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/main.css');

      const mockFetch = vi.fn().mockResolvedValue(new Response('.btn { color: red; }'));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      expect(result.tagName).toBe('STYLE');
      expect(result).toBeInstanceOf(HTMLStyleElement);
      expect((result as HTMLStyleElement).dataset.href).toBe('http://localhost:8000/styles/main.css');
    });

    it('fetches the CSS and sets @scope-wrapped content as textContent', async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/main.css');

      const cssContent = '.container { margin: 0; }';
      const mockFetch = vi.fn().mockResolvedValue(new Response(cssContent));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      await vi.waitFor(() => {
        expect((result as HTMLStyleElement).textContent).toBeTruthy();
      });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/styles/main.css');
      expect((result as HTMLStyleElement).textContent).toContain('@scope ([data-name="test-app"])');
      expect((result as HTMLStyleElement).textContent).toContain('.container { margin: 0; }');
    });

    it('falls back to @import on fetch failure', async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/broken.css');

      const mockFetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      await vi.waitFor(() => {
        expect((result as HTMLStyleElement).textContent).toBeTruthy();
      });

      expect((result as HTMLStyleElement).textContent).toBe('@import url("http://localhost:8000/styles/broken.css");');
    });

    it('does not affect non-stylesheet links', () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.setAttribute('href', '/scripts/main.js');
      link.as = 'script';

      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation }));
      expect(result).toBe(link);
      expect(result.tagName).toBe('LINK');
    });

    it('does not affect links without href', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';

      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation }));
      expect(result).toBe(link);
    });

    it('handles CSS with @keyframes by prefixing animation names', async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/animations.css');

      const cssContent = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.element { animation-name: fadeIn; }`;
      const mockFetch = vi.fn().mockResolvedValue(new Response(cssContent));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      await vi.waitFor(() => {
        expect((result as HTMLStyleElement).textContent).toBeTruthy();
      });

      expect((result as HTMLStyleElement).textContent).toContain('@keyframes __qk_test-app_fadeIn');
      expect((result as HTMLStyleElement).textContent).toContain('animation-name: __qk_test-app_fadeIn');
    });

    it('hoists @font-face outside @scope in fetched CSS', async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/fonts.css');

      const cssContent = `
@font-face { font-family: 'MyFont'; src: url('/fonts/myfont.woff2'); }
.text { font-family: 'MyFont'; }`;
      const mockFetch = vi.fn().mockResolvedValue(new Response(cssContent));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      await vi.waitFor(() => {
        expect((result as HTMLStyleElement).textContent).toBeTruthy();
      });

      const text = (result as HTMLStyleElement).textContent!;
      const fontFacePos = text.indexOf('@font-face');
      const scopePos = text.indexOf('@scope');
      expect(fontFacePos).toBeGreaterThanOrEqual(0);
      expect(scopePos).toBeGreaterThan(fontFacePos);
    });
  });
});
