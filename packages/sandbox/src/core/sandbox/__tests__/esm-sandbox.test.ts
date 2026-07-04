import { describe, expect, it } from 'vitest';
import { StandardSandbox } from '../StandardSandbox';

declare global {
  interface Window {
    __qk_test_internal__?: unknown;
    __qk_realm_probe__?: unknown;
    __qk_nonconfigurable__?: unknown;
  }
}

describe('membrane internal global shielding', () => {
  it('shields __qk_* keys of the real global from the sandbox proxy', () => {
    window.__qk_test_internal__ = () => 'secret';
    const sandbox = new StandardSandbox('shield-test', {}, window);
    const proxy = sandbox.globalThis as unknown as Record<string, unknown>;

    expect(proxy.__qk_test_internal__).toBeUndefined();
    expect('__qk_test_internal__' in proxy).toBe(false);
    expect(Object.getOwnPropertyDescriptor(proxy, '__qk_test_internal__')).toBeUndefined();
    expect(Object.keys(proxy)).not.toContain('__qk_test_internal__');

    delete window.__qk_test_internal__;
  });

  it('does not shield __qk_* keys the sandboxed code wrote itself', () => {
    const sandbox = new StandardSandbox('own-key-test', {}, window);
    const proxy = sandbox.globalThis as unknown as Record<string, unknown>;

    proxy.__qk_realm_probe__ = 42;
    expect(proxy.__qk_realm_probe__).toBe(42);
    // and it never leaks to the real global
    expect(window.__qk_realm_probe__).toBeUndefined();
  });

  it('keeps shielding a NON-CONFIGURABLE __qk_* real-global key (2nd+ instance)', () => {
    // the realm accessor is installed on the real global as non-configurable; createMembraneTarget must
    // NOT copy it into the target (that would make it an own prop and stop the shield for later apps)
    Object.defineProperty(window, '__qk_nonconfigurable__', {
      value: () => 'secret',
      configurable: false,
      enumerable: false,
      writable: false,
    });

    const sandbox = new StandardSandbox('nonconfigurable-shield-test', {}, window);
    const proxy = sandbox.globalThis as unknown as Record<string, unknown>;

    expect(proxy.__qk_nonconfigurable__).toBeUndefined();
    expect('__qk_nonconfigurable__' in proxy).toBe(false);
    // non-configurable keys cannot be redefined away, so leave it on window (harmless, unenumerable)
  });
});

describe('esm globals view', () => {
  it('builds a per-instance view whose keys resolve through the membrane proxy', () => {
    const sandbox = new StandardSandbox('view-test', {}, window);
    const view = sandbox.getEsmGlobalsView();

    // window/self/globalThis must resolve to the sandbox proxy itself, never the real window
    expect(view.window).toBe(sandbox.globalThis);
    expect(view.self).toBe(sandbox.globalThis);
    expect(view.globalThis).toBe(sandbox.globalThis);
  });

  it('observes membrane mutations lazily instead of snapshotting at build time', () => {
    const sandbox = new StandardSandbox('lazy-view-test', {}, window);
    const view = sandbox.getEsmGlobalsView();
    const proxy = sandbox.globalThis as unknown as Record<string, unknown>;

    proxy.history = 'patched-history';
    expect(view.history).toBe('patched-history');
  });

  it('returns the same view instance across calls', () => {
    const sandbox = new StandardSandbox('same-view-test', {}, window);
    expect(sandbox.getEsmGlobalsView()).toBe(sandbox.getEsmGlobalsView());
  });
});
