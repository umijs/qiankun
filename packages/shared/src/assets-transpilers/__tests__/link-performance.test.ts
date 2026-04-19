import { beforeEach, describe, expect, it, vi } from 'vitest';
import transpileLink, { clearStylesheetCache, getStylesheetCacheStats } from '../link';
import type { AssetsTranspilerOpts } from '../types';

describe('link transpiler performance', () => {
  beforeEach(() => {
    clearStylesheetCache();
  });

  const createMockFetch = (cssContent: string, delay = 0) => {
    return vi.fn(async () => {
      if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
      return {
        text: async () => cssContent,
      } as Response;
    });
  };

  const createLink = (href: string): HTMLLinkElement => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    return link;
  };

  const createOpts = (fetch: typeof window.fetch, appName = 'test-app'): AssetsTranspilerOpts => ({
    fetch,
    sandbox: true,
    styleIsolation: {
      appName,
      scopeRoot: `[data-name="${appName}"]`,
    },
  });

  describe('cache hit performance', () => {
    it('should cache raw CSS and avoid redundant fetches', async () => {
      const cssContent = '.button { color: blue; padding: 10px; }';
      const mockFetch = createMockFetch(cssContent, 50);
      const opts = createOpts(mockFetch);

      const link1 = createLink('https://example.com/styles.css');
      const link2 = createLink('https://example.com/styles.css');

      // First call - should fetch
      const style1 = transpileLink(link1, 'https://example.com/', opts) as HTMLStyleElement;
      await vi.waitFor(() => expect(style1.textContent).toBeTruthy(), { timeout: 200 });

      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const start = performance.now();
      const style2 = transpileLink(link2, 'https://example.com/', opts) as HTMLStyleElement;
      const duration = performance.now() - start;

      // Cache hit should be nearly instant (< 5ms)
      expect(duration).toBeLessThan(5);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No additional fetch
      expect(style2.textContent).toBeTruthy();
    });

    it('should cache transpiled results per app', async () => {
      const cssContent = '.header { font-size: 16px; }';
      const mockFetch = createMockFetch(cssContent, 30);

      // First app
      const opts1 = createOpts(mockFetch, 'app1');
      const link1 = createLink('https://example.com/common.css');
      const style1 = transpileLink(link1, 'https://example.com/', opts1) as HTMLStyleElement;
      await vi.waitFor(() => expect(style1.textContent).toBeTruthy(), { timeout: 200 });

      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second app - same URL, different app
      const opts2 = createOpts(mockFetch, 'app2');
      const link2 = createLink('https://example.com/common.css');
      const start = performance.now();
      const style2 = transpileLink(link2, 'https://example.com/', opts2) as HTMLStyleElement;
      const duration = performance.now() - start;

      // Should reuse raw CSS but transpile for new app (still fast)
      expect(duration).toBeLessThan(5);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No additional fetch
      await vi.waitFor(() => expect(style2.textContent).toBeTruthy(), { timeout: 100 });

      // Both should have scoped content but with different app names
      expect(style1.textContent).toContain('[data-name="app1"]');
      expect(style2.textContent).toContain('[data-name="app2"]');
    });

    it('should handle multiple concurrent requests efficiently', async () => {
      const cssContent = '.container { width: 100%; }';
      const mockFetch = createMockFetch(cssContent, 100);
      const opts = createOpts(mockFetch);

      const links = Array.from({ length: 10 }, () => createLink('https://example.com/layout.css'));

      const start = performance.now();
      const styles = links.map((link) => transpileLink(link, 'https://example.com/', opts) as HTMLStyleElement);
      const syncDuration = performance.now() - start;

      // All 10 calls should complete synchronously in < 10ms
      expect(syncDuration).toBeLessThan(10);

      // Wait for all to resolve
      await vi.waitFor(
        () => {
          expect(styles.every((s) => s.textContent)).toBe(true);
        },
        { timeout: 300 },
      );

      // Should only fetch once despite 10 requests
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('cache statistics', () => {
    it('should track cache entries correctly', async () => {
      const mockFetch = createMockFetch('.test { color: red; }', 10);
      const opts1 = createOpts(mockFetch, 'app1');
      const opts2 = createOpts(mockFetch, 'app2');

      const link1 = createLink('https://example.com/a.css');
      const link2 = createLink('https://example.com/b.css');

      const style1 = transpileLink(link1, 'https://example.com/', opts1) as HTMLStyleElement;
      const style2 = transpileLink(link2, 'https://example.com/', opts1) as HTMLStyleElement;
      const style3 = transpileLink(link1, 'https://example.com/', opts2) as HTMLStyleElement;

      // Wait for all styles to be populated
      await vi.waitFor(
        () => {
          return style1.textContent && style2.textContent && style3.textContent;
        },
        { timeout: 1000 },
      );

      // Give a bit more time for cache to be updated
      await new Promise((resolve) => setTimeout(resolve, 50));

      const stats = getStylesheetCacheStats();
      expect(stats.size).toBe(2);
      expect(stats.entries).toHaveLength(2);

      // First URL should have 2 transpiled versions (app1 and app2)
      const entry1 = stats.entries.find((e) => e.url === 'https://example.com/a.css');
      expect(entry1?.transpiledCount).toBe(2);

      // Second URL should have 1 transpiled version (app1 only)
      const entry2 = stats.entries.find((e) => e.url === 'https://example.com/b.css');
      expect(entry2?.transpiledCount).toBe(1);
    });

    it('should clear cache correctly', async () => {
      const mockFetch = createMockFetch('.test { color: blue; }', 10);
      const opts = createOpts(mockFetch);

      const link = createLink('https://example.com/test.css');
      transpileLink(link, 'https://example.com/', opts);

      await vi.waitFor(() => getStylesheetCacheStats().size === 1);

      clearStylesheetCache();
      const stats = getStylesheetCacheStats();
      expect(stats.size).toBe(0);
      expect(stats.entries).toHaveLength(0);
    });
  });

  describe('performance benchmarks', () => {
    it('should demonstrate cache performance improvement', async () => {
      const largeCSS = Array.from({ length: 100 }, (_, i) => `.class-${i} { color: red; }`).join('\n');
      const mockFetch = createMockFetch(largeCSS, 100);
      const opts = createOpts(mockFetch);

      // First call - cold cache
      const link1 = createLink('https://example.com/large.css');
      const coldStart = performance.now();
      const style1 = transpileLink(link1, 'https://example.com/', opts) as HTMLStyleElement;
      await vi.waitFor(() => expect(style1.textContent).toBeTruthy(), { timeout: 300 });
      const coldDuration = performance.now() - coldStart;

      // Second call - warm cache
      const link2 = createLink('https://example.com/large.css');
      const warmStart = performance.now();
      const style2 = transpileLink(link2, 'https://example.com/', opts) as HTMLStyleElement;
      const warmDuration = performance.now() - warmStart;

      // Warm cache should be at least 10x faster
      expect(warmDuration).toBeLessThan(coldDuration / 10);
      expect(warmDuration).toBeLessThan(5);

      // Both should have the same content
      expect(style1.textContent).toBe(style2.textContent);
    });

    it('should measure memory efficiency of shared raw CSS', async () => {
      const cssContent = '.shared { background: white; }';
      const mockFetch = createMockFetch(cssContent, 10);

      const apps = ['app1', 'app2', 'app3', 'app4', 'app5'];
      const link = createLink('https://example.com/shared.css');
      const styles: HTMLStyleElement[] = [];

      for (const appName of apps) {
        const opts = createOpts(mockFetch, appName);
        const style = transpileLink(link, 'https://example.com/', opts) as HTMLStyleElement;
        styles.push(style);
      }

      // Wait for all styles to be populated
      await vi.waitFor(
        () => {
          return styles.every((s) => s.textContent);
        },
        { timeout: 1000 },
      );

      // Give a bit more time for cache to be updated
      await new Promise((resolve) => setTimeout(resolve, 50));

      const stats = getStylesheetCacheStats();
      expect(stats.size).toBe(1); // Only one URL cached
      expect(stats.entries[0].transpiledCount).toBe(5); // 5 transpiled versions
      expect(stats.entries[0].rawSize).toBe(cssContent.length); // Raw CSS stored once

      // Verify only one fetch occurred
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
