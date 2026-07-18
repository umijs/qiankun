import { describe, expect, it } from 'vitest';
import { StandardSandbox } from '../StandardSandbox';

declare global {
  interface Window {
    __qk_test_internal__?: unknown;
    __qk_instance_probe__?: unknown;
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

    proxy.__qk_instance_probe__ = 42;
    expect(proxy.__qk_instance_probe__).toBe(42);
    // and it never leaks to the real global
    expect(window.__qk_instance_probe__).toBeUndefined();
  });

  it('keeps shielding a NON-CONFIGURABLE __qk_* real-global key (2nd+ instance)', () => {
    // the instance accessor is installed on the real global as non-configurable; createMembraneTarget must
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

describe('standard Compartment preset', () => {
  it('makes reserved self globals point to the compartment even when extra globals collide', () => {
    const sandbox = new StandardSandbox(
      'self-reference-test',
      {
        window: 'host escape',
        self: 'host escape',
        globalThis: 'host escape',
        top: 'host escape',
        parent: 'host escape',
      },
      window,
    );
    const view = sandbox.globalThis as unknown as Record<string, unknown>;

    expect(view.window).toBe(sandbox.globalThis);
    expect(view.self).toBe(sandbox.globalThis);
    expect(view.globalThis).toBe(sandbox.globalThis);
    expect(view.top).toBe(sandbox.globalThis);
    expect(view.parent).toBe(sandbox.globalThis);
  });

  it('preserves top and parent escape semantics for an iframe-like incubator', () => {
    const outerWindow = { marker: 'outer' } as unknown as WindowProxy;
    const iframeWindow = new Proxy(window, {
      get(target, property, receiver) {
        if (property === 'top' || property === 'parent') return outerWindow;
        return Reflect.get(target, property, receiver) as unknown;
      },
    });
    const sandbox = new StandardSandbox('nested-context-test', {}, iframeWindow);
    const view = sandbox.globalThis as unknown as Record<string, unknown>;

    expect(view.window).toBe(sandbox.globalThis);
    expect(view.top).toBe(outerWindow);
    expect(view.parent).toBe(outerWindow);
  });

  it('preserves proxy and borrowed hasOwnProperty behavior', () => {
    const sandbox = new StandardSandbox('has-own-test', {}, window);
    const view = sandbox.globalThis as unknown as Record<string, unknown>;
    const hasOwn = Reflect.get(view, 'hasOwnProperty') as (this: unknown, key: PropertyKey) => boolean;

    view.owned = true;

    expect(hasOwn.call(view, 'owned')).toBe(true);
    expect(hasOwn.call({ borrowed: true }, 'borrowed')).toBe(true);
  });

  it('locks writes while inactive and accepts them again after active', () => {
    const sandbox = new StandardSandbox('lifecycle-test', {}, window);
    const view = sandbox.globalThis as unknown as Record<string, unknown>;

    sandbox.inactive();
    view.whileInactive = true;
    expect(view.whileInactive).toBeUndefined();

    sandbox.active();
    view.afterActive = true;
    expect(view.afterActive).toBe(true);
  });
});
