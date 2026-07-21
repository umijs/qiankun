import type { IsolationPluginConfig } from '../../types';
import { createSandbox } from '../../../core/sandbox';
import { afterEach, describe, expect, it } from 'vitest';

let appSequence = 0;
const controllers: Array<ReturnType<typeof createSandbox>> = [];
const containers: HTMLElement[] = [];

function createController(nodeTransformer: IsolationPluginConfig['nodeTransformer']) {
  const appName = `stylesheet-ledger-${String(appSequence++)}`;
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

describe.sequential('dynamic stylesheet ledger', () => {
  afterEach(async () => {
    await Promise.all(controllers.splice(0).map(async (controller) => controller.dispose()));
    containers.splice(0).forEach((container) => container.remove());
  });

  it('transpiles hint links without recording them for remount replay', async () => {
    const transformedNodes: Node[] = [];
    const transformer: IsolationPluginConfig['nodeTransformer'] = (node) => {
      transformedNodes.push(node);
      return node;
    };
    const { container, controller } = createController(transformer);
    await controller.mount(container);

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.setAttribute('href', 'data:text/css,.ledger{color:red}');
    container.appendChild(stylesheet);

    const hint = document.createElement('link');
    hint.rel = 'preload';
    hint.as = 'script';
    hint.setAttribute('href', 'data:text/javascript,');
    container.appendChild(hint);

    // both go through the transformer (hint URLs must still resolve against the app entry)...
    expect(transformedNodes).toContain(stylesheet);
    expect(transformedNodes).toContain(hint);
    expect(container.contains(stylesheet)).toBe(true);
    expect(container.contains(hint)).toBe(true);

    await controller.unmount();
    // the host clears the container between mounts (loadApp's clearContainer)
    container.querySelectorAll('link').forEach((link) => link.remove());
    await controller.mount(container);

    // ...but only the stylesheet is replayed by the ledger
    const replayed = container.querySelectorAll('link');
    expect(replayed).toHaveLength(1);
    expect(replayed[0].rel).toBe('stylesheet');
    expect(container.querySelector('link[rel="preload"]')).toBeNull();
  });

  it('settles a fallback-adopted stylesheet when the app removes it again', async () => {
    const { container, controller } = createController((node) => node);
    await controller.mount(container);

    // created outside the sandboxed createElement — adopted via the mount-point fallback
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.setAttribute('href', 'data:text/css,.removed{}');
    container.appendChild(stylesheet);
    expect(container.contains(stylesheet)).toBe(true);

    container.removeChild(stylesheet);

    await controller.unmount();
    await controller.mount(container);

    expect(container.querySelector('link[rel="stylesheet"]')).toBeNull();
  });
});
