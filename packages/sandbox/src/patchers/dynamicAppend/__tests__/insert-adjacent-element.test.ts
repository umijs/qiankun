import { createSandbox } from '../../../core/sandbox';
import { type IsolationPluginConfig } from '../../types';
import { type SandboxConfig } from '../types';
import { afterEach, describe, expect, it, vi } from 'vitest';

let appSequence = 0;
const controllers: Array<ReturnType<typeof createSandbox>> = [];
const containers: HTMLElement[] = [];

function createController() {
  const container = document.createElement('div');
  container.innerHTML = '<qiankun-head></qiankun-head>';
  document.body.appendChild(container);
  containers.push(container);
  const nodeTransformer = vi.fn<IsolationPluginConfig['nodeTransformer']>((node) => node);
  const controller = createSandbox(`insert-adjacent-${String(appSequence++)}`, {
    container,
    nodeTransformer,
    fetch: window.fetch,
  });
  controllers.push(controller);
  const sharedState = Reflect.get(window, Symbol.for('qiankun.dynamicAppend.sharedState')) as {
    sandboxConfigs: WeakMap<object, SandboxConfig>;
  };
  const config = sharedState.sandboxConfigs.get(controller.instance);
  if (!config) throw new Error('sandbox config was not registered at bootstrap');
  const head = container.querySelector('qiankun-head')!;
  return {
    container,
    head,
    controller,
    nodeTransformer,
    config,
    sandboxDocument: controller.instance.globalThis.document,
  };
}

describe.sequential('Element.prototype.insertAdjacentElement under the dynamic append patch', () => {
  afterEach(async () => {
    await Promise.all(controllers.splice(0).map(async (controller) => controller.dispose()));
    containers.splice(0).forEach((container) => container.remove());
  });

  it('routes a style inserted next to a sibling of the head through the pipeline (Vite dev css)', () => {
    const { head, sandboxDocument, nodeTransformer, config } = createController();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const first = sandboxDocument.createElement('style') as HTMLStyleElement;
    head.appendChild(first);
    const second = sandboxDocument.createElement('style') as HTMLStyleElement;

    expect(first.insertAdjacentElement('afterend', second)).toBe(second);

    expect(Array.from(head.children)).toEqual([first, second]);
    expect(nodeTransformer.mock.calls.map(([node]) => node)).toEqual([first, second]);
    expect(config.dynamicStyleSheetElements).toEqual([first, second]);
  });

  it.each([
    ['beforebegin', ['first', 'inserted', 'anchor', 'tail']],
    ['afterbegin', ['inserted', 'first', 'anchor', 'tail']],
    ['beforeend', ['first', 'anchor', 'tail', 'inserted']],
    ['afterend', ['first', 'anchor', 'inserted', 'tail']],
  ] as const)('keeps the native position semantics for %s', (where, expected) => {
    const { head, nodeTransformer, config } = createController();
    const names = new Map<Element, string>();
    const mark = (name: string, element: Element) => names.set(element, name);
    const first = document.createElement('meta');
    const anchor = document.createElement('meta');
    const tail = document.createElement('meta');
    mark('first', first);
    mark('anchor', anchor);
    mark('tail', tail);
    head.append(first, anchor, tail);
    // the receiver is the head itself for the inside positions, the anchor otherwise
    const receiver = where === 'afterbegin' || where === 'beforeend' ? head : anchor;
    const inserted = document.createElement('link');
    inserted.rel = 'stylesheet';
    mark('inserted', inserted);
    const order = () => Array.from(head.children).map((child) => names.get(child));

    expect(receiver.insertAdjacentElement(where, inserted)).toBe(inserted);

    expect(order()).toEqual(expected);
    expect(nodeTransformer).toHaveBeenCalledWith(inserted, expect.anything());
    expect(config.dynamicStyleSheetElements).toEqual([inserted]);
  });

  it('routes scripts through the pipeline as well', () => {
    const { head, nodeTransformer } = createController();
    const script = document.createElement('script');
    script.textContent = '/* noop */';

    head.insertAdjacentElement('beforeend', script);

    expect(nodeTransformer.mock.calls.map(([node]) => node)).toEqual([script]);
    expect(script.parentNode).toBe(head);
  });

  it('inserts the same element natively when the insertion point is not a mount point', () => {
    const { container, nodeTransformer, config } = createController();
    const section = document.createElement('section');
    container.appendChild(section);
    const style = document.createElement('style');
    const mark = document.createElement('meta');

    section.insertAdjacentElement('beforeend', mark);
    expect(section.insertAdjacentElement('beforeend', style)).toBe(style);

    expect(Array.from(section.children)).toEqual([mark, style]);
    expect(nodeTransformer).not.toHaveBeenCalled();
    expect(config.dynamicStyleSheetElements).toHaveLength(0);
  });

  it('leaves non-hijacked elements to the native implementation', () => {
    const { head, nodeTransformer } = createController();
    const meta = document.createElement('meta');

    expect(head.insertAdjacentElement('beforeend', meta)).toBe(meta);
    expect(nodeTransformer).not.toHaveBeenCalled();
  });

  it('returns null for a detached receiver, like the native method', () => {
    createController();
    const detached = document.createElement('style');
    expect(detached.insertAdjacentElement('afterend', document.createElement('style'))).toBeNull();
  });

  it('restores the native method once every sandbox is disposed', async () => {
    const native = Element.prototype.insertAdjacentElement;
    const { controller } = createController();
    expect(Element.prototype.insertAdjacentElement).not.toBe(native);
    await controller.dispose();
    controllers.splice(controllers.indexOf(controller), 1);
    expect(Element.prototype.insertAdjacentElement).toBe(native);
  });
});
