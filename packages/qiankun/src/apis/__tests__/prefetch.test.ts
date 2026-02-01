/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('prefetchApps', () => {
  let mockFetch: any;

  beforeEach(async () => {
    mockFetch = vi.fn().mockResolvedValue({
      text: () =>
        Promise.resolve(
          '<html><head><script src="app.js"></script><link rel="stylesheet" href="style.css"></head><body></body></html>',
        ),
    });

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

    prefetchApps(apps, mockFetch as unknown as typeof fetch);

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:7100/');
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:7200/');
  });

  it('should prefetch external scripts and stylesheets', async () => {
    const { prefetchApps } = await import('../prefetch');
    const apps = [{ name: 'app1', entry: 'http://localhost:7100/' }];

    prefetchApps(apps, mockFetch as unknown as typeof fetch);

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should fetch the HTML entry
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:7100/');
    // Should also fetch external resources (script and stylesheet)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:7100/app.js');
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:7100/style.css');
  });
});
