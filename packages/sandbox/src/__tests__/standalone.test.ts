import { afterEach, describe, expect, it, vi } from 'vitest';
import * as sandboxApi from '../index';
import { createSandbox, prepareSandboxContainer, StandardSandbox } from '../index';

const mountedContainers: HTMLElement[] = [];

function appendContainer(): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  mountedContainers.push(container);
  return container;
}

afterEach(() => {
  mountedContainers.splice(0).forEach((container) => container.remove());
  vi.restoreAllMocks();
});

describe('standalone sandbox public journey', () => {
  it('creates a JS-only preset with appName as its only required input', async () => {
    const controller = createSandbox('standalone-js');
    const view = controller.instance.globalThis as unknown as Record<string, unknown>;
    const listener = vi.fn();

    expect(controller.instance).toBeInstanceOf(StandardSandbox);
    expect('createSandboxContainer' in sandboxApi).toBe(false);
    expect(view.window).toBe(controller.instance.globalThis);
    expect(view.self).toBe(controller.instance.globalThis);
    expect(view.globalThis).toBe(controller.instance.globalThis);

    await controller.mount();
    controller.instance.globalThis.addEventListener('standalone-event', listener);
    await controller.unmount();
    window.dispatchEvent(new Event('standalone-event'));

    expect(listener).not.toHaveBeenCalled();
    await controller.dispose();
  });

  it('leaves an explicitly mounted container untouched in the JS-only preset', async () => {
    const container = appendContainer();
    const controller = createSandbox('standalone-js-mount-target');

    await controller.mount(container);

    expect(container.hasAttribute('data-name')).toBe(false);
    expect(container.querySelector('qiankun-head')).toBeNull();

    await controller.unmount();
    await controller.dispose();
    expect(container.hasAttribute('data-name')).toBe(false);
    expect(container.querySelector('qiankun-head')).toBeNull();
  });

  it('rejects style isolation without a container', () => {
    expect(() => createSandbox('standalone-style-no-container', { styleIsolation: true })).toThrow(
      /requires a container when style isolation is enabled/,
    );
  });

  it('uses an isolation-preserving default transformer for classic scripts', async () => {
    const controller = createSandbox('standalone-transformer');
    const script = document.createElement('script');
    script.textContent = 'window.thirdPartyWrite = true;';

    const transformed = controller.nodeTransformer(script, { fetch: window.fetch });

    expect(transformed).toBe(script);
    expect(script.dataset.consumed).toBe('true');
    expect(script.textContent).toContain('window.__compartment_globalThis__');
    expect(script.textContent).toContain('window.thirdPartyWrite = true;');
    expect(window).not.toHaveProperty('thirdPartyWrite');
    await controller.dispose();
  });

  it('contains dynamic DOM and scopes styles after a container-backed mount', async () => {
    const container = appendContainer();
    const controller = createSandbox('standalone-dom', { container, styleIsolation: true });

    expect(container.dataset.name).toBe('standalone-dom');
    expect(container.querySelector('qiankun-head')).toBeNull();

    await controller.mount();
    const sandboxDocument = controller.instance.globalThis.document;
    const style = sandboxDocument.createElement('style');
    style.textContent = '.widget { color: rebeccapurple; }';
    sandboxDocument.head.appendChild(style);
    const script = sandboxDocument.createElement('script');
    script.textContent = 'window.dynamicWidgetLoaded = true;';
    sandboxDocument.body.appendChild(script);

    expect(container.querySelectorAll('qiankun-head')).toHaveLength(1);
    expect(container.querySelector('qiankun-head')?.contains(style)).toBe(true);
    expect(style.textContent).toContain('@scope ([data-name="standalone-dom"])');
    expect(container.contains(script)).toBe(true);
    expect(script.textContent).toContain('window.__compartment_globalThis__');

    await controller.unmount();
    await controller.dispose();
    expect(container.querySelector('qiankun-head')).toBeNull();
    expect(container.hasAttribute('data-name')).toBe(false);
  });

  it('provisions no head when the embedder pipeline owns the container structure', async () => {
    const container = appendContainer();
    const controller = createSandbox('standalone-external-head', { container, provisionContainerHead: false });

    // the orchestrator (e.g. qiankun's streaming loader) decides whether a head exists —
    // an empty container stays structurally untouched at mount
    await controller.mount();
    expect(container.querySelector('qiankun-head')).toBeNull();
    await controller.unmount();

    // a head materialized by that pipeline is picked up as-is and never removed by dispose
    const externalHead = document.createElement('qiankun-head');
    container.appendChild(externalHead);
    await controller.mount();
    expect(container.querySelector('qiankun-head')).toBe(externalHead);

    await controller.dispose();
    expect(container.querySelector('qiankun-head')).toBe(externalHead);
  });

  it('resolves a container getter again when remounting', async () => {
    const firstContainer = appendContainer();
    const secondContainer = appendContainer();
    let currentContainer = firstContainer;
    const controller = createSandbox('standalone-remount', { container: () => currentContainer });

    await controller.mount();
    expect(firstContainer.querySelectorAll('qiankun-head')).toHaveLength(1);
    await controller.unmount();

    currentContainer = secondContainer;
    await controller.mount();
    expect(secondContainer.dataset.name).toBe('standalone-remount');
    expect(secondContainer.querySelectorAll('qiankun-head')).toHaveLength(1);

    await controller.dispose();
    expect(firstContainer.querySelector('qiankun-head')).toBeNull();
    expect(secondContainer.querySelector('qiankun-head')).toBeNull();
  });

  it('imports ESM namespaces through the public module hooks', async () => {
    const importHook = vi.fn(async () => ({ namespace: { answer: 42 } }));
    const controller = createSandbox('standalone-esm', {
      importHook,
      resolveHook: (specifier) => specifier,
    });

    await expect(controller.instance.import('widget:entry')).resolves.toEqual({ answer: 42 });
    expect(importHook).toHaveBeenCalledWith('widget:entry');
    await controller.dispose();
  });

  it('lets a top-level module-hook alias override the lower-level alias pair', async () => {
    const lowerImportHook = vi.fn(async () => ({ namespace: { source: 'lower' } }));
    const topLevelLoadHook = vi.fn(async () => ({ namespace: { source: 'top-level' } }));
    const controller = createSandbox('standalone-hook-precedence', {
      compartmentOptions: { importHook: lowerImportHook },
      loadHook: topLevelLoadHook,
      resolveHook: (specifier) => specifier,
    });

    await expect(controller.instance.import('widget:entry')).resolves.toEqual({ source: 'top-level' });
    expect(topLevelLoadHook).toHaveBeenCalledWith('widget:entry');
    expect(lowerImportHook).not.toHaveBeenCalled();
    await controller.dispose();
  });

  it('uses the top-level fetch option for standalone ESM loading', async () => {
    const fetch = vi.fn(async () => new Response('export const ready = true;', { status: 200 }));
    const lowerLevelFetch = vi.fn(async () => new Response('export const ready = false;', { status: 200 }));
    const moduleImporter = vi.fn(async () => ({ ready: true }));
    const controller = createSandbox('standalone-fetch', {
      compartmentOptions: {
        moduleHost: {
          createModuleUrl: () => 'blob:standalone-fetch',
          fetch: lowerLevelFetch,
          moduleImporter,
          revokeModuleUrl: () => {},
        },
      },
      fetch,
    });

    await expect(controller.instance.import('https://standalone.test/entry.js')).resolves.toEqual({ ready: true });
    expect(fetch).toHaveBeenCalledWith('https://standalone.test/entry.js', undefined);
    expect(lowerLevelFetch).not.toHaveBeenCalled();
    expect(moduleImporter).toHaveBeenCalledWith('blob:standalone-fetch');
    await controller.dispose();
  });

  it('preserves the lower-level module fetch when no top-level fetch is provided', async () => {
    const fetch = vi.fn(async () => new Response('export const ready = true;', { status: 200 }));
    const moduleImporter = vi.fn(async () => ({ ready: true }));
    const controller = createSandbox('standalone-lower-fetch', {
      compartmentOptions: {
        moduleHost: {
          createModuleUrl: () => 'blob:standalone-lower-fetch',
          fetch,
          moduleImporter,
          revokeModuleUrl: () => {},
        },
      },
    });

    await expect(controller.instance.import('https://standalone.test/lower.js')).resolves.toEqual({ ready: true });
    expect(fetch).toHaveBeenCalledWith('https://standalone.test/lower.js', undefined);
    await controller.dispose();
  });

  it('uses the top-level fetch option for external dynamic classic scripts', async () => {
    const fetch = vi.fn(async () => new Response('window.dynamicAssetLoaded = true;', { status: 200 }));
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:standalone-dynamic-fetch');
    const controller = createSandbox('standalone-dynamic-fetch', { fetch });
    const script = document.createElement('script');
    script.setAttribute('src', 'https://standalone.test/widget.js');

    controller.nodeTransformer(script, { fetch: window.fetch });

    expect(fetch).toHaveBeenCalledWith('https://standalone.test/widget.js', {
      credentials: undefined,
      priority: 'high',
    });
    await vi.waitFor(() => expect(script.src).toBe('blob:standalone-dynamic-fetch'));
    await controller.dispose();
  });
});

describe('prepareSandboxContainer', () => {
  it('reuses an existing head and restores the previous data-name on cleanup', () => {
    const container = appendContainer();
    container.dataset.name = 'host-owned';
    const existingHead = document.createElement('qiankun-head');
    container.appendChild(existingHead);

    const preparation = prepareSandboxContainer(container, 'prepared-app');

    expect(preparation.styleIsolation).toEqual({
      appName: 'prepared-app',
      scopeRoot: '[data-name="prepared-app"]',
    });
    expect(container.querySelectorAll('qiankun-head')).toHaveLength(1);
    expect(container.querySelector('qiankun-head')).toBe(existingHead);

    preparation.cleanup();
    preparation.cleanup();
    expect(container.dataset.name).toBe('host-owned');
    expect(container.querySelector('qiankun-head')).toBe(existingHead);
  });

  it('removes only the head and data-name created by the helper', () => {
    const container = appendContainer();
    const { cleanup } = prepareSandboxContainer(container, 'prepared-app');

    expect(container.querySelectorAll('qiankun-head')).toHaveLength(1);
    expect(container.dataset.name).toBe('prepared-app');

    cleanup();
    expect(container.querySelector('qiankun-head')).toBeNull();
    expect(container.hasAttribute('data-name')).toBe(false);
  });

  it('keeps shared preparation state until the last owner cleans up', () => {
    const container = appendContainer();
    const first = prepareSandboxContainer(container, 'shared-app');
    const second = prepareSandboxContainer(container, 'shared-app');

    first.cleanup();
    expect(container.dataset.name).toBe('shared-app');
    expect(container.querySelectorAll('qiankun-head')).toHaveLength(1);

    second.cleanup();
    expect(container.hasAttribute('data-name')).toBe(false);
    expect(container.querySelector('qiankun-head')).toBeNull();
  });

  it('preserves a host data-name update made after preparation', () => {
    const container = appendContainer();
    const { cleanup } = prepareSandboxContainer(container, 'prepared-app');

    container.dataset.name = 'host-update';
    cleanup();

    expect(container.dataset.name).toBe('host-update');
    expect(container.querySelector('qiankun-head')).toBeNull();
  });
});
