import { createSandbox } from '../../../core/sandbox';
import { type IsolationPluginConfig } from '../../types';
import { type SandboxConfig } from '../types';
import { afterEach, describe, expect, it, vi } from 'vitest';

let appSequence = 0;
const controllers: Array<ReturnType<typeof createSandbox>> = [];
const containers: HTMLElement[] = [];

function createController() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  containers.push(container);
  const nodeTransformer = vi.fn<IsolationPluginConfig['nodeTransformer']>((node) => node);
  const controller = createSandbox(`head-patching-${String(appSequence++)}`, {
    container,
    provisionContainerHead: false,
    nodeTransformer,
    fetch: window.fetch,
  });
  controllers.push(controller);
  const sharedState = Reflect.get(window, Symbol.for('qiankun.dynamicAppend.sharedState')) as {
    sandboxConfigs: WeakMap<object, SandboxConfig>;
  };
  const config = sharedState.sandboxConfigs.get(controller.instance);
  if (!config) throw new Error('sandbox config was not registered at bootstrap');
  return { container, controller, nodeTransformer, config, sandboxDocument: controller.instance.globalThis.document };
}

describe.sequential('virtual head patching', () => {
  afterEach(async () => {
    await Promise.all(controllers.splice(0).map(async (controller) => controller.dispose()));
    containers.splice(0).forEach((container) => container.remove());
  });

  it.each(['head', 'querySelector'] as const)('patches a newly inserted head before %s returns it', (accessor) => {
    const { container, sandboxDocument, nodeTransformer, config } = createController();
    const readHead = () => (accessor === 'head' ? sandboxDocument.head : sandboxDocument.querySelector('head'));
    expect(readHead).toThrow(/head element not existed/);

    const head = document.createElement('qiankun-head');
    container.appendChild(head);
    // Stay in the insertion task: MutationObserver has not delivered the new head yet.
    expect(Object.hasOwn(head, 'appendChild')).toBe(false);
    expect(readHead()).toBe(head);
    for (const method of ['appendChild', 'insertBefore', 'removeChild']) {
      expect(Object.hasOwn(head, method)).toBe(true);
    }

    const style = sandboxDocument.createElement('style');
    const link = sandboxDocument.createElement('link');
    link.rel = 'stylesheet';
    head.appendChild(style);
    head.insertBefore(link, style);
    const script = sandboxDocument.createElement('script');
    head.appendChild(script);

    expect(nodeTransformer.mock.calls.map(([node]) => node)).toEqual([style, link, script]);
    expect(config.dynamicStyleSheetElements).toEqual([style, link]);
    head.removeChild(style);
    expect(config.dynamicStyleSheetElements).toEqual([link]);
  });

  it('preserves app method wrappers across repeated reads and observer delivery', async () => {
    const { container, controller, sandboxDocument, nodeTransformer, config } = createController();
    const head = document.createElement('qiankun-head');
    container.appendChild(head);
    expect(sandboxDocument.head).toBe(head);
    const appendChild = head.appendChild.bind(head);
    const wrapper = vi.fn(appendChild);
    head.appendChild = wrapper;

    // A separate observer proves that delivery has occurred without relying on a timer.
    await new Promise<void>((resolve) => {
      const observer = new MutationObserver(() => {
        observer.disconnect();
        resolve();
      });
      observer.observe(head, { childList: true });
      head.appendChild(document.createComment('deliver observers'));
    });
    expect(sandboxDocument.head).toBe(head);
    expect(sandboxDocument.querySelector('head')).toBe(head);
    expect(head.appendChild).toBe(wrapper);

    const style = sandboxDocument.createElement('style');
    head.appendChild(style);
    expect(nodeTransformer).toHaveBeenCalledTimes(1);
    expect(config.dynamicStyleSheetElements).toEqual([style]);
    await controller.dispose();
    expect(head.appendChild).toBe(wrapper);
    expect(Object.hasOwn(head, 'insertBefore')).toBe(false);
    expect(Object.hasOwn(head, 'removeChild')).toBe(false);
  });

  it('still patches a streamed head through the observer when no getter is used', async () => {
    const { container, controller } = createController();
    const head = document.createElement('qiankun-head');
    container.appendChild(head);
    await vi.waitFor(() => expect(Object.hasOwn(head, 'appendChild')).toBe(true));

    await controller.dispose();
    for (const method of ['appendChild', 'insertBefore', 'removeChild']) {
      expect(Object.hasOwn(head, method)).toBe(false);
    }
  });

  it('patches replacement heads and releases every patched head', async () => {
    const { container, controller, sandboxDocument } = createController();
    const firstHead = document.createElement('qiankun-head');
    container.appendChild(firstHead);
    expect(sandboxDocument.head).toBe(firstHead);

    const secondHead = document.createElement('qiankun-head');
    firstHead.replaceWith(secondHead);
    expect(sandboxDocument.head).toBe(secondHead);
    expect(Object.hasOwn(secondHead, 'appendChild')).toBe(true);

    await controller.dispose();
    for (const head of [firstHead, secondHead]) {
      for (const method of ['appendChild', 'insertBefore', 'removeChild']) {
        expect(Object.hasOwn(head, method)).toBe(false);
      }
    }
  });

  it('uses the active installation when a script retains its document across remounts', async () => {
    const { container, controller, sandboxDocument, nodeTransformer } = createController();
    const firstHead = document.createElement('qiankun-head');
    container.appendChild(firstHead);
    await controller.mount(container);
    await controller.unmount();

    // Accessing the retained proxy while unmounted must not restore released methods.
    expect(sandboxDocument.head).toBe(firstHead);
    expect(Object.hasOwn(firstHead, 'appendChild')).toBe(false);
    await controller.mount(container);
    const secondHead = document.createElement('qiankun-head');
    firstHead.replaceWith(secondHead);
    // ESM modules can keep the original document binding across subsequent mounts.
    expect(sandboxDocument.head).toBe(secondHead);
    expect(Object.hasOwn(secondHead, 'appendChild')).toBe(true);
    const style = sandboxDocument.createElement('style');
    sandboxDocument.head.appendChild(style);
    expect(nodeTransformer).toHaveBeenCalledTimes(1);

    await controller.dispose();
    expect(() => sandboxDocument.head).toThrow(TypeError);
    expect(Object.hasOwn(secondHead, 'appendChild')).toBe(false);
  });

  it('does not let an old document getter take ownership from a later sandbox', async () => {
    const first = createController();
    const secondTransformer = vi.fn<IsolationPluginConfig['nodeTransformer']>((node) => node);
    const second = createSandbox('head-patching-takeover', {
      container: first.container,
      provisionContainerHead: false,
      nodeTransformer: secondTransformer,
      fetch: window.fetch,
    });
    controllers.push(second);

    const head = document.createElement('qiankun-head');
    first.container.appendChild(head);
    expect(second.instance.globalThis.document.head).toBe(head);
    expect(first.sandboxDocument.head).toBe(head);
    await first.controller.dispose();
    const style = document.createElement('style');
    head.appendChild(style);
    expect(secondTransformer).toHaveBeenCalledTimes(1);
    expect(first.nodeTransformer).not.toHaveBeenCalled();
    expect(first.config.dynamicStyleSheetElements).toHaveLength(0);
  });
});
