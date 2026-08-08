/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createSandbox: vi.fn(),
  loadEntry: vi.fn(),
}));

vi.mock('@qiankunjs/loader', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  loadEntry: mocks.loadEntry,
}));

vi.mock('@qiankunjs/sandbox', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createSandbox: mocks.createSandbox,
}));

import { triggerAppChange } from '@qiankunjs/single-spa';
import { registerMicroApps, start } from '../registerMicroApps';

describe('registerMicroApps', () => {
  // Regression test for the vendored fork's canonical bootstrap lifecycle (the revert of the
  // upstream bootstrap->init rename, see packages/single-spa/README.md): a micro app exporting
  // the classic `bootstrap` lifecycle must have it invoked on the registerMicroApps path, where
  // upstream v7 would silently ignore it.
  it('invokes a micro app bootstrap lifecycle on the registerMicroApps path', async () => {
    const bootstrap = vi.fn(async (): Promise<void> => {});
    const mount = vi.fn(async (): Promise<void> => {});
    const unmount = vi.fn(async (): Promise<void> => {});

    mocks.createSandbox.mockReturnValue({
      dispose: vi.fn(async () => {}),
      instance: {
        globalThis: window,
        latestSetProp: undefined,
      },
      nodeTransformer: (node: Node) => node,
      mount: vi.fn(async () => {}),
      unmount: vi.fn(async () => {}),
    });
    mocks.loadEntry.mockResolvedValue({ bootstrap, mount, unmount });

    const container = document.createElement('div');
    document.body.appendChild(container);

    registerMicroApps([
      {
        name: 'legacy-bootstrap-app',
        entry: '/legacy-bootstrap.html',
        container,
        activeRule: () => true,
      },
    ]);
    start();
    await triggerAppChange();

    expect(bootstrap).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledTimes(1);
  });
});
