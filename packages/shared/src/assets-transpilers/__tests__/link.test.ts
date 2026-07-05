import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import transpileLink, { clearStylesheetCache } from '../link';
import type { AssetsTranspilerOpts } from '../types';

const baseURI = 'http://localhost:8000/';

const makeOpts = (overrides?: Partial<AssetsTranspilerOpts>): AssetsTranspilerOpts => ({
  fetch: window.fetch,
  ...overrides,
});

// Capture the blobs behind the object urls the transpiler creates, so tests can assert the
// @scope-wrapped CSS without needing the environment to actually load blob stylesheets
const blobsByUrl = new Map<string, Blob>();
const readBlobCss = async (link: HTMLElement): Promise<string> => {
  const href = link.getAttribute('href')!;
  const blob = blobsByUrl.get(href);
  if (!blob) throw new Error(`no blob captured for ${href}`);
  return blob.text();
};
const waitForBlobHref = async (link: HTMLElement): Promise<void> => {
  await vi.waitFor(() => {
    expect(link.getAttribute('href')).toMatch(/^blob:/);
  });
};

describe('transpileLink', () => {
  beforeEach(() => {
    if (typeof URL.createObjectURL !== 'function') {
      URL.createObjectURL = () => '';
      URL.revokeObjectURL = () => {};
    }
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      const url = `blob:mock/${blobsByUrl.size}`;
      blobsByUrl.set(url, blob as Blob);
      return url;
    });
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    clearStylesheetCache();
    blobsByUrl.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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

    it('keeps the <link> element and moves its href aside while transpiling', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/main.css');

      const mockFetch = vi.fn().mockResolvedValue(new Response('.btn { color: red; }'));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      // node identity is the whole point: app-attached handlers and native link semantics survive
      expect(result).toBe(link);
      expect(result.tagName).toBe('LINK');
      // the original href must never hit the network as an unscoped stylesheet
      expect(link.getAttribute('href')).toBeNull();
      expect(link.dataset.href).toBe('http://localhost:8000/styles/main.css');
    });

    it('fetches the CSS and lands an @scope-wrapped blob href', async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/main.css');

      const cssContent = '.container { margin: 0; }';
      const mockFetch = vi.fn().mockResolvedValue(new Response(cssContent));
      transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      await waitForBlobHref(link);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/styles/main.css');
      const css = await readBlobCss(link);
      expect(css).toContain('@scope ([data-name="test-app"])');
      expect(css).toContain('.container { margin: 0; }');
    });

    it('dispatches an error event and drops the stylesheet on fetch failure', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/broken.css');
      const onerror = vi.fn();
      link.addEventListener('error', onerror);

      const mockFetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
      transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      await vi.waitFor(() => {
        expect(onerror).toHaveBeenCalled();
      });

      // no href is ever set: the unscoped stylesheet must not leak globally
      expect(link.getAttribute('href')).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('dropped to preserve isolation'));
      consoleSpy.mockRestore();
    });

    it('keeps native link attributes untouched (media/disabled/nonce/title)', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/print.css');
      link.setAttribute('media', 'print');
      link.setAttribute('nonce', 'abc123');
      link.setAttribute('title', 'Alternative Theme');
      link.disabled = true;

      const mockFetch = vi.fn().mockResolvedValue(new Response('.print { color: black; }'));
      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      expect(result).toBe(link);
      expect(link.getAttribute('media')).toBe('print');
      expect(link.getAttribute('nonce')).toBe('abc123');
      expect(link.getAttribute('title')).toBe('Alternative Theme');
      expect(link.disabled).toBe(true);
    });

    it('reuses the same blob url for the same stylesheet and app', async () => {
      const link1 = document.createElement('link');
      link1.rel = 'stylesheet';
      link1.setAttribute('href', '/styles/main.css');
      const link2 = document.createElement('link');
      link2.rel = 'stylesheet';
      link2.setAttribute('href', '/styles/main.css');

      const mockFetch = vi.fn().mockResolvedValue(new Response('.shared { color: red; }'));
      transpileLink(link1, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));
      await waitForBlobHref(link1);

      transpileLink(link2, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));
      // cache hit applies synchronously
      expect(link2.getAttribute('href')).toBe(link1.getAttribute('href'));
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('passes baseURL so relative CSS assets get resolved', async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/main.css');

      const cssContent = `.bg { background: url("../images/hero.png"); }`;
      const mockFetch = vi.fn().mockResolvedValue(new Response(cssContent));
      transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      await waitForBlobHref(link);
      expect(await readBlobCss(link)).toContain('url("http://localhost:8000/images/hero.png")');
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

    it('rewrites a stylesheet preload to as=fetch so it matches the transpiler fetch', () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.setAttribute('href', '/styles/main.css');

      const result = transpileLink(link, baseURI, makeOpts({ styleIsolation })) as HTMLLinkElement;
      expect(result).toBe(link);
      expect(result.as).toBe('fetch');
      expect(result.crossOrigin).toBe('anonymous');
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
      transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      await waitForBlobHref(link);
      const css = await readBlobCss(link);
      expect(css).toContain('@keyframes __qk_test-app_fadeIn');
      expect(css).toContain('animation-name: __qk_test-app_fadeIn');
    });

    it('hoists @font-face outside @scope in fetched CSS', async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('href', '/styles/fonts.css');

      const cssContent = `
@font-face { font-family: 'MyFont'; src: url('/fonts/myfont.woff2'); }
.text { font-family: 'MyFont'; }`;
      const mockFetch = vi.fn().mockResolvedValue(new Response(cssContent));
      transpileLink(link, baseURI, makeOpts({ styleIsolation, fetch: mockFetch }));

      await waitForBlobHref(link);
      const css = await readBlobCss(link);
      const fontFacePos = css.indexOf('@font-face');
      const scopePos = css.indexOf('@scope');
      expect(fontFacePos).toBeGreaterThanOrEqual(0);
      expect(scopePos).toBeGreaterThan(fontFacePos);
    });
  });
});
