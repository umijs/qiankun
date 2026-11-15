import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSandbox } from '../../../core/sandbox';
import { type IsolationPluginConfig } from '../../types';

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
  return { container, controller, nodeTransformer, sandboxDocument: controller.instance.globalThis.document };
}

describe.sequential('virtual head patching', () => {
  afterEach(async () => {
    await Promise.all(controllers.splice(0).map(async (controller) => controller.dispose()));
    containers.splice(0).forEach((container) => container.remove());
  });

  it.each(['head', 'querySelector'] as const)(
    'patches a newly inserted head before %s returns it and tracks dynamic stylesheets until removed',
    async (accessor) => {
      const { container, controller, sandboxDocument, nodeTransformer } = createController();
      const readHead = () => (accessor === 'head' ? sandboxDocument.head : sandboxDocument.querySelector('head'));
      expect(readHead).toThrow(/head element not existed/);

      const head = document.createElement('qiankun-head');
      container.appendChild(head);
      expect(readHead()).toBe(head);

      const style = sandboxDocument.createElement('style');
      const keptStyle = sandboxDocument.createElement('style');
      keptStyle.dataset.keep = 'true';
      head.appendChild(style);
      head.insertBefore(keptStyle, style);
      const script = sandboxDocument.createElement('script');
      head.appendChild(script);

      expect(nodeTransformer.mock.calls.map(([node]) => node)).toEqual([style, keptStyle, script]);

      // Removing a dynamically appended stylesheet drops it from remount replay while keeping remaining styles.
      head.removeChild(style);
      await controller.mount(container);
      await controller.unmount();
      head.innerHTML = '';

      await controller.mount(container);
      expect(head.querySelectorAll('style')).toHaveLength(1);
      expect((head.querySelector('style') as HTMLElement).dataset.keep).toBe('true');
    },
  );

  it('preserves app method wrappers across observer delivery and stops intercepting after dispose', async () => {
    const { container, controller, sandboxDocument, nodeTransformer } = createController();
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
    expect(wrapper).toHaveBeenCalledWith(style);

    await controller.dispose();
    nodeTransformer.mockClear();
    expect(head.appendChild).toBe(wrapper);

    head.appendChild(document.createElement('style'));
    expect(nodeTransformer).not.toHaveBeenCalled();
  });

  it('patches a streamed head through the observer when no getter is used and cleans up on dispose', async () => {
    const { container, controller, nodeTransformer } = createController();
    const head = document.createElement('qiankun-head');

    // A later-registered observer on container runs after the sandbox's own MutationObserver.
    await new Promise<void>((resolve) => {
      const observer = new MutationObserver(() => {
        observer.disconnect();
        resolve();
      });
      observer.observe(container, { childList: true });
      container.appendChild(head);
    });

    const probe = document.createElement('style');
    head.appendChild(probe);
    expect(nodeTransformer.mock.calls.map(([node]) => node)).toEqual([probe]);

    await controller.dispose();
    nodeTransformer.mockClear();
    head.appendChild(document.createElement('style'));
    expect(nodeTransformer).not.toHaveBeenCalled();
  });

  it('patches replacement heads and releases every patched head on dispose', async () => {
    const { container, controller, sandboxDocument, nodeTransformer } = createController();
    const firstHead = document.createElement('qiankun-head');
    container.appendChild(firstHead);
    expect(sandboxDocument.head).toBe(firstHead);

    const secondHead = document.createElement('qiankun-head');
    firstHead.replaceWith(secondHead);
    expect(sandboxDocument.head).toBe(secondHead);

    const style = document.createElement('style');
    secondHead.appendChild(style);
    expect(nodeTransformer.mock.calls.map(([node]) => node)).toEqual([style]);

    await controller.dispose();
    nodeTransformer.mockClear();
    firstHead.appendChild(document.createElement('style'));
    secondHead.appendChild(document.createElement('style'));
    expect(nodeTransformer).not.toHaveBeenCalled();
  });

  it('uses the active installation when a script retains its document across remounts', async () => {
    const { container, controller, sandboxDocument, nodeTransformer } = createController();
    const firstHead = document.createElement('qiankun-head');
    container.appendChild(firstHead);
    await controller.mount(container);
    await controller.unmount();

    // Accessing the retained proxy while unmounted must not restore interception.
    expect(sandboxDocument.head).toBe(firstHead);
    firstHead.appendChild(document.createElement('style'));
    expect(nodeTransformer).not.toHaveBeenCalled();

    await controller.mount(container);
    const secondHead = document.createElement('qiankun-head');
    firstHead.replaceWith(secondHead);
    // ESM modules can keep the original document binding across subsequent mounts.
    expect(sandboxDocument.head).toBe(secondHead);
    const style = sandboxDocument.createElement('style');
    sandboxDocument.head.appendChild(style);
    expect(nodeTransformer).toHaveBeenCalledTimes(1);

    await controller.dispose();
    expect(() => sandboxDocument.head).toThrow(TypeError);
    nodeTransformer.mockClear();
    secondHead.appendChild(document.createElement('style'));
    expect(nodeTransformer).not.toHaveBeenCalled();
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
  });
});
