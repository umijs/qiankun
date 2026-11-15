/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('prefetchApps', () => {
  let mockFetch: ReturnType<typeof vi.fn<typeof fetch>>;

  beforeEach(async () => {
    mockFetch = vi.fn<typeof fetch>(
      async () =>
        new Response(
          '<html><head><script src="app.js"></script><link rel="stylesheet" href="style.css"></head><body></body></html>',
        ),
    );

    // Mock navigator.onLine
    Object.defineProperty(window, 'navigator', {
      value: {
        onLine: true,
        connection: undefined,
      },
      writable: true,
      configurable: true,
    });

    // Mock requestIdleCallback
    vi.stubGlobal('requestIdleCallback', (cb: IdleRequestCallback) => {
      cb({ didTimeout: false, timeRemaining: () => 50 });
      return 1;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('should prefetch apps with given entries', async () => {
    const { prefetchApps } = await import('../prefetch');
    const apps = [
      { name: 'app1', entry: 'http://localhost:7100/' },
      { name: 'app2', entry: 'http://localhost:7200/' },
    ];

    prefetchApps(apps, mockFetch);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:7100/');
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:7200/');
    });
  });

  it('should prefetch external scripts and stylesheets', async () => {
    const { prefetchApps } = await import('../prefetch');
    const apps = [{ name: 'app1', entry: 'http://localhost:7100/' }];

    prefetchApps(apps, mockFetch);

    await vi.waitFor(() => {
      // Should fetch the HTML entry and external resources (script and stylesheet)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:7100/');
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:7100/app.js');
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:7100/style.css');
    });
  });
});
