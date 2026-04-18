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

    it('drops the stylesheet (empty <style>) on fetch failure to preserve isolation', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/broken.css');

      const mockFetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      await vi.waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      // Must NOT contain an un-scoped @import that would leak globally.
      expect((result as HTMLStyleElement).textContent).not.toContain('@import');
      expect((result as HTMLStyleElement).textContent ?? '').toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('dropped to preserve isolation'),
      );
      consoleSpy.mockRestore();
    });

    it('copies media attribute from <link> to generated <style>', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/print.css');
      link.setAttribute('media', 'print');

      const mockFetch = vi.fn().mockResolvedValue(new Response('.print { color: black; }'));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      expect(result.tagName).toBe('STYLE');
      expect(result.getAttribute('media')).toBe('print');
    });

    it('copies disabled state from <link> to generated <style>', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/optional.css');
      link.disabled = true;

      const mockFetch = vi.fn().mockResolvedValue(new Response('.opt { color: gray; }'));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      expect(result.tagName).toBe('STYLE');
      expect((result as HTMLStyleElement).disabled).toBe(true);
    });

    it('copies nonce attribute from <link> to generated <style>', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/secure.css');
      link.setAttribute('nonce', 'abc123');

      const mockFetch = vi.fn().mockResolvedValue(new Response('.sec { color: green; }'));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      expect(result.tagName).toBe('STYLE');
      expect(result.getAttribute('nonce')).toBe('abc123');
    });

    it('copies title attribute from <link> to generated <style>', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/alt.css');
      link.setAttribute('title', 'Alternative Theme');

      const mockFetch = vi.fn().mockResolvedValue(new Response('.alt { color: navy; }'));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      expect(result.tagName).toBe('STYLE');
      expect(result.getAttribute('title')).toBe('Alternative Theme');
    });

    it('passes baseURL so relative CSS assets get resolved', async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/main.css');

      const cssContent = `.bg { background: url("../images/hero.png"); }`;
      const mockFetch = vi.fn().mockResolvedValue(new Response(cssContent));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      await vi.waitFor(() => {
        expect((result as HTMLStyleElement).textContent).toBeTruthy();
      });

      expect((result as HTMLStyleElement).textContent).toContain('url("http://localhost:8000/images/hero.png")');
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
