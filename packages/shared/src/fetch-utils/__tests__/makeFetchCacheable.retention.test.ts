// @vitest-environment node

import { setFlagsFromString } from 'node:v8';
import { runInNewContext } from 'node:vm';
import { expect, it } from 'vitest';
import { makeFetchCacheable } from '../makeFetchCacheable';

setFlagsFromString('--expose_gc');
const gc = runInNewContext('gc') as () => void;

const LRU_CAPACITY = 50;

const collectGarbage = async (): Promise<void> => {
  for (let round = 0; round < 6; round += 1) {
    await new Promise((resolve) => setTimeout(resolve));
    gc();
  }
};

it('lets responses evicted from the LRU be collected while the wrapper is still alive', async () => {
  const responses: Array<WeakRef<Response>> = [];
  const app = makeFetchCacheable(async () => {
    const response = new Response('x'.repeat(1024));
    responses.push(new WeakRef(response));
    return response;
  });
  const url = (index: number) => `https://retention.qiankun.org/${index}`;

  for (let index = 0; index < LRU_CAPACITY * 4; index += 1) {
    await (await app(url(index))).text();
  }
  // The first URL was evicted, so reading it again goes back to the transport.
  await (await app(url(0))).text();
  expect(responses).toHaveLength(LRU_CAPACITY * 4 + 1);

  await collectGarbage();
  const alive = responses.filter((response) => response.deref() !== undefined).length;
  expect(alive).toBeLessThanOrEqual(LRU_CAPACITY);

  // Keep the wrapper reachable until after the measurement; its lifetime is not what frees them.
  app.invalidate();
});
