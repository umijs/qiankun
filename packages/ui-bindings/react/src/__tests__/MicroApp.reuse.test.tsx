/**
 * @vitest-environment happy-dom
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

// The real loadMicroApp with only the entry loading stubbed, so the binding drives qiankun's
// instance reuse end to end.
const mocks = vi.hoisted(() => ({ loadApp: vi.fn() }));
vi.mock('../../../../qiankun/src/core/loadApp', () => ({ default: mocks.loadApp }));

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MicroApp } from '../MicroApp';

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe('MicroApp with qiankun instance reuse', () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.resetAllMocks();
  });

  it('hands the unmounting instance to the element a keyed swap renders', async () => {
    const bootstrap = vi.fn(async () => {});
    const mount = vi.fn(async (_container: HTMLElement) => {});
    const unmount = vi.fn(async () => {});
    const getter = Object.defineProperties(
      (container: HTMLElement) => ({ bootstrap, mount: async () => mount(container), unmount }),
      { occupiesContainer: { get: () => false }, loadPhaseOpen: { get: () => false } },
    );
    mocks.loadApp.mockResolvedValue(getter);

    const host = document.createElement('div');
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => {
      root.render(<MicroApp key="1" name="keyed-swap" entry="//localhost:7100" />);
    });
    await settle();
    const [first] = mount.mock.calls[0];

    // e.g. `<MicroApp key={params.id}>` when the route goes from /a/1 to /a/2
    await act(async () => {
      root.render(<MicroApp key="2" name="keyed-swap" entry="//localhost:7100" />);
    });
    await settle();

    expect(mocks.loadApp).toHaveBeenCalledTimes(1);
    expect(bootstrap).toHaveBeenCalledTimes(1);
    expect(unmount).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledTimes(2);
    expect(mount.mock.calls[1][0]).not.toBe(first);
    expect(mount.mock.calls[1][0]).toBe(host.querySelector('.qiankun-micro-app-container'));

    act(() => root.unmount());
    await settle();
  });
});
