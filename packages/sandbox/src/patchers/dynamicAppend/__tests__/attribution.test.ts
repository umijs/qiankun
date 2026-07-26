import type { IsolationPluginConfig } from '../../types';
import { createSandbox } from '../../../core/sandbox';
import { isNativePassthroughNode, markNodeForNativePassthrough } from '../../../core/nativePassthrough';
import type { SandboxConfig } from '../types';
import { afterEach, describe, expect, it, vi } from 'vitest';

const identityNodeTransformer: IsolationPluginConfig['nodeTransformer'] = (node) => node;

let appSequence = 0;
const controllers: Array<ReturnType<typeof createSandbox>> = [];
const containers: HTMLElement[] = [];

function createController(nodeTransformer: IsolationPluginConfig['nodeTransformer'] = identityNodeTransformer) {
  const appName = `attribution-${String(appSequence++)}`;
  const container = document.createElement('div');
  container.innerHTML = '<qiankun-head></qiankun-head>';
  document.body.appendChild(container);
  containers.push(container);

  const controller = createSandbox(appName, {
    container: () => container,
    fetch: window.fetch,
    nodeTransformer,
    styleIsolation: true,
  });
  controllers.push(controller);
  return { container, controller };
}

function getSharedState() {
  return Reflect.get(window, Symbol.for('qiankun.dynamicAppend.sharedState')) as {
    sandboxConfigs: WeakMap<object, SandboxConfig>;
    elementConfigs: WeakMap<HTMLElement, SandboxConfig>;
  };
}

function getSandboxConfigOf(controller: ReturnType<typeof createSandbox>): SandboxConfig {
  const config = getSharedState().sandboxConfigs.get(controller.instance);
  if (!config) throw new Error('sandbox config was not registered at bootstrap');
  return config;
}

describe.sequential('insertion-point attribution', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    await Promise.all(controllers.splice(0).map(async (controller) => controller.dispose()));
    containers.splice(0).forEach((container) => container.remove());
  });

  it('no longer stamps ownership at createElement time', async () => {
    const { container, controller } = createController();
    await controller.mount(container);

    const script = controller.instance.globalThis.document.createElement('script');
    expect(getSharedState().elementConfigs.get(script)).toBeUndefined();
  });

  it('attributes a hijackable element to its insertion point regardless of creator', async () => {
    const a = createController();
    const b = createController();
    await a.controller.mount(a.container);
    await b.controller.mount(b.container);

    // created through B's sandboxed document, inserted into A's container
    const stylesheet = b.controller.instance.globalThis.document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.setAttribute('href', 'data:text/css,.cross{}');
    a.container.appendChild(stylesheet);

    const configA = getSandboxConfigOf(a.controller);
    expect(getSharedState().elementConfigs.get(stylesheet)).toBe(configA);
    expect(configA.dynamicStyleSheetElements).toContain(stylesheet);
    expect(getSandboxConfigOf(b.controller).dynamicStyleSheetElements).not.toContain(stylesheet);
  });

  it('re-attributes an element moved across mount points and warns about it', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const a = createController();
    const b = createController();
    await a.controller.mount(a.container);
    await b.controller.mount(b.container);

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.setAttribute('href', 'data:text/css,.moved{}');
    a.container.appendChild(stylesheet);
    a.container.removeChild(stylesheet);
    expect(getSandboxConfigOf(a.controller).dynamicStyleSheetElements).not.toContain(stylesheet);

    b.container.appendChild(stylesheet);

    expect(getSharedState().elementConfigs.get(stylesheet)).toBe(getSandboxConfigOf(b.controller));
    expect(getSandboxConfigOf(b.controller).dynamicStyleSheetElements).toContain(stylesheet);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('re-attributed'));
  });

  it('clears the mount-point stamps once the sandbox is disposed', async () => {
    const { container, controller } = createController();
    await controller.mount(container);

    const headElement = container.querySelector<HTMLElement>('qiankun-head');
    if (!headElement) throw new Error('virtual head was not prepared');
    const config = getSandboxConfigOf(controller);
    expect(getSharedState().elementConfigs.get(container)).toBe(config);
    expect(getSharedState().elementConfigs.get(headElement)).toBe(config);

    await controller.dispose();

    // a disposed sandbox must no longer be resolvable as a style owner by DOM position
    expect(getSharedState().elementConfigs.get(container)).toBeUndefined();
    expect(getSharedState().elementConfigs.get(headElement)).toBeUndefined();
  });

  it('passes pipeline-marked nodes through natively', async () => {
    const transformedNodes: Node[] = [];
    const { container, controller } = createController((node) => {
      transformedNodes.push(node);
      return node;
    });
    await controller.mount(container);

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.setAttribute('href', 'data:text/css,.transpiled{}');
    markNodeForNativePassthrough(stylesheet);
    container.appendChild(stylesheet);

    expect(container.contains(stylesheet)).toBe(true);
    expect(transformedNodes).not.toContain(stylesheet);
    expect(getSharedState().elementConfigs.get(stylesheet)).toBeUndefined();
    expect(getSandboxConfigOf(controller).dynamicStyleSheetElements).not.toContain(stylesheet);
  });

  it('stamps the controller transformer output while the dynamic pipeline output stays bare', async () => {
    const { container, controller } = createController();
    await controller.mount(container);

    // the controller's public transformer is the pipeline variant: its output is final
    // pipeline product and passes the patched mount points natively
    const pipelineScript = document.createElement('script');
    pipelineScript.textContent = 'window.pipelineOutput = true;';
    const transformed = controller.nodeTransformer(pipelineScript, { fetch: window.fetch });
    expect(isNativePassthroughNode(transformed)).toBe(true);

    // the dynamic-append pipeline transpiles through the bare variant: its output must stay
    // unmarked so a later re-insertion re-enters the pipeline for ledger bookkeeping
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.setAttribute('href', 'data:text/css,.dynamic{}');
    container.appendChild(stylesheet);
    expect(getSandboxConfigOf(controller).dynamicStyleSheetElements).toContain(stylesheet);
    expect(isNativePassthroughNode(stylesheet)).toBe(false);
  });

  it('scopes insertRule by the stylesheet current DOM position', async () => {
    const { container, controller } = createController();
    await controller.mount(container);
    const config = getSandboxConfigOf(controller);

    // injected below a non-mount-point insertion target, as CSS-in-JS custom targets do
    const deepTarget = document.createElement('div');
    container.appendChild(deepTarget);
    const style = document.createElement('style');
    deepTarget.appendChild(style);
    expect(getSharedState().elementConfigs.get(style)).toBeUndefined();

    // happy-dom sheets carry no ownerNode, so drive the patched prototype with an explicit one;
    // ownership resolution runs before the native insertRule call, which may reject the fake sheet
    const { insertRule } = CSSStyleSheet.prototype;
    const sheetOf = (ownerNode: HTMLElement) => ({ ownerNode }) as unknown as CSSStyleSheet;
    try {
      insertRule.call(sheetOf(style), '.deep { color: red; }', 0);
    } catch {
      /* resolution already happened */
    }
    // ownership resolved by position (nearest tagged ancestor is the container mount point)
    expect(getSharedState().elementConfigs.get(style)).toBe(config);

    // a stylesheet living outside any tagged container resolves to no owner and stays unscoped
    const outsideStyle = document.createElement('style');
    document.body.appendChild(outsideStyle);
    try {
      insertRule.call(sheetOf(outsideStyle), '.outside { color: red; }', 0);
    } catch {
      /* resolution already happened */
    }
    expect(getSharedState().elementConfigs.get(outsideStyle)).toBeUndefined();
    outsideStyle.remove();
  });
});
