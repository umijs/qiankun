import type { IsolationPluginConfig } from '../../types';
import { createSandbox } from '../../../core/sandbox';
import { styleElementTargetSymbol } from '../common';
import type { SandboxConfig } from '../types';
import { markLoaderStreamedNode } from '@qiankunjs/shared';
import { afterEach, describe, expect, it } from 'vitest';

const identityNodeTransformer: IsolationPluginConfig['nodeTransformer'] = (node) => node;

let appSequence = 0;
const controllers: Array<ReturnType<typeof createSandbox>> = [];
const containers: HTMLElement[] = [];

function createController() {
  const appName = `dynamic-append-lifecycle-${String(appSequence++)}`;
  const container = document.createElement('div');
  container.innerHTML = '<qiankun-head></qiankun-head>';
  document.body.appendChild(container);
  containers.push(container);

  const controller = createSandbox(appName, {
    container: () => container,
    fetch: window.fetch,
    nodeTransformer: identityNodeTransformer,
    styleIsolation: true,
  });
  controllers.push(controller);
  return { container, controller };
}

describe.sequential('dynamic append patch lifecycle', () => {
  afterEach(async () => {
    await Promise.all(controllers.splice(0).map(async (controller) => controller.dispose()));
    containers.splice(0).forEach((container) => container.remove());
  });

  it('keeps realm-wide prototype patches until every controller releases them', async () => {
    const nativeObserve = MutationObserver.prototype.observe;
    const nativeCompareDocumentPosition = Node.prototype.compareDocumentPosition;
    const nativeInsertRule = CSSStyleSheet.prototype.insertRule;
    const first = createController();
    const second = createController();

    expect(MutationObserver.prototype.observe).not.toBe(nativeObserve);
    expect(Node.prototype.compareDocumentPosition).not.toBe(nativeCompareDocumentPosition);
    expect(CSSStyleSheet.prototype.insertRule).not.toBe(nativeInsertRule);

    await first.controller.mount(first.container);
    await second.controller.mount(second.container);
    await first.controller.unmount();

    expect(MutationObserver.prototype.observe).not.toBe(nativeObserve);
    expect(Node.prototype.compareDocumentPosition).not.toBe(nativeCompareDocumentPosition);
    expect(CSSStyleSheet.prototype.insertRule).not.toBe(nativeInsertRule);

    await second.controller.unmount();
    expect(MutationObserver.prototype.observe).toBe(nativeObserve);
    expect(Node.prototype.compareDocumentPosition).toBe(nativeCompareDocumentPosition);
    expect(CSSStyleSheet.prototype.insertRule).toBe(nativeInsertRule);
  });

  it('restores container methods and patches them again on remount without leaking refs', async () => {
    const nativeObserve = MutationObserver.prototype.observe;
    const { container, controller } = createController();

    await controller.mount(container);
    expect(Object.hasOwn(container, 'appendChild')).toBe(true);

    await controller.unmount();
    expect(Object.hasOwn(container, 'appendChild')).toBe(false);
    expect(MutationObserver.prototype.observe).toBe(nativeObserve);

    await controller.mount(container);
    expect(Object.hasOwn(container, 'appendChild')).toBe(true);
    expect(MutationObserver.prototype.observe).not.toBe(nativeObserve);

    await controller.unmount();
    expect(Object.hasOwn(container, 'appendChild')).toBe(false);
    expect(MutationObserver.prototype.observe).toBe(nativeObserve);
  });

  it('rolls back the freshly installed mount patch when stylesheet reattachment fails', async () => {
    const nativeObserve = MutationObserver.prototype.observe;
    const { container, controller } = createController();

    // Seed a recorded head-targeted stylesheet, then break the container head so
    // reattachDynamicStylesheets rejects during mount.
    const sharedState = Reflect.get(window, Symbol.for('qiankun.dynamicAppend.sharedState')) as {
      sandboxConfigs: WeakMap<object, SandboxConfig>;
    };
    const sandboxConfig = sharedState.sandboxConfigs.get(controller.instance);
    if (!sandboxConfig) throw new Error('sandbox config was not registered at bootstrap');
    const headStyle = document.createElement('style') as HTMLStyleElement & {
      [styleElementTargetSymbol]?: string;
    };
    headStyle[styleElementTargetSymbol] = 'head';
    sandboxConfig.dynamicStyleSheetElements.push(headStyle);
    container.querySelector('qiankun-head')?.remove();
    const streamedNode = document.createElement('div');
    markLoaderStreamedNode(streamedNode);
    container.appendChild(streamedNode);

    await expect(controller.mount(container)).rejects.toThrow(/not ready while rebuilding/);

    // The failed mount must leave no patch behind: neither the container methods
    // nor the shared DOM-prototype patches (bootstrap's own patch is rolled back
    // by the container, the mount-phase one by the plugin itself).
    expect(Object.hasOwn(container, 'appendChild')).toBe(false);
    expect(MutationObserver.prototype.observe).toBe(nativeObserve);
  });
});
