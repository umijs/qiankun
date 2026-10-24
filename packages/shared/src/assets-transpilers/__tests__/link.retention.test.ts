// @vitest-environment happy-dom

import { setFlagsFromString } from 'node:v8';
import { runInNewContext } from 'node:vm';
import { expect, it } from 'vitest';
import transpileLink from '../link';
import { disposeCompartmentAssets } from '../script';

setFlagsFromString('--expose_gc');
const gc = runInNewContext('gc') as () => void;

function createLinks(fetch: typeof window.fetch, phase: string): Array<WeakRef<HTMLLinkElement>> {
  const references: Array<WeakRef<HTMLLinkElement>> = [];
  for (let index = 0; index < 20; index++) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://retention.qiankun.org/style.css';
    references.push(new WeakRef(link));
    transpileLink(link, 'https://retention.qiankun.org/', { fetch });
    if (phase !== 'pending') link.dispatchEvent(new Event(phase));
  }
  return references;
}

it.each(['pending', 'load', 'error'])(
  'does not retain detached %s links while the asset owner is alive',
  async (phase) => {
    const fetch = async () => new Response('');
    const references = createLinks(fetch, phase);
    for (let round = 0; round < 6; round++) {
      await new Promise((resolve) => setTimeout(resolve));
      gc();
    }
    const alive = references.filter((reference) => reference.deref() !== undefined).length;
    // Keep the owner reachable through the measurement and check disposal tolerates collected nodes.
    disposeCompartmentAssets(fetch);
    expect(alive).toBe(0);
  },
);
