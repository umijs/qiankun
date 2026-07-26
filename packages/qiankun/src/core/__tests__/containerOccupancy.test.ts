/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import { acquireContainer } from '../containerOccupancy';

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve));

describe('container occupancy gate', () => {
  it('grants an uncontended container immediately', async () => {
    const container = document.createElement('div');
    const release = await acquireContainer(container, 'a');
    release();

    // a released container is immediately acquirable again
    const releaseAgain = await acquireContainer(container, 'a');
    releaseAgain();
  });

  it('serializes contending holders FIFO', async () => {
    const container = document.createElement('div');
    const grantOrder: string[] = [];

    const releaseA = await acquireContainer(container, 'a');
    const bPromise = acquireContainer(container, 'b').then((release) => {
      grantOrder.push('b');
      return release;
    });
    const cPromise = acquireContainer(container, 'c').then((release) => {
      grantOrder.push('c');
      return release;
    });

    await flushMicrotasks();
    expect(grantOrder).toEqual([]);

    releaseA();
    const releaseB = await bPromise;
    await flushMicrotasks();
    expect(grantOrder).toEqual(['b']);

    releaseB();
    const releaseC = await cPromise;
    expect(grantOrder).toEqual(['b', 'c']);
    releaseC();
  });

  it('ignores duplicate releases of one hold', async () => {
    const container = document.createElement('div');
    const releaseA = await acquireContainer(container, 'a');
    const bPromise = acquireContainer(container, 'b');
    let cGranted = false;
    void acquireContainer(container, 'c').then((release) => {
      cGranted = true;
      release();
    });

    // the failure fallback and the regular release point may both fire for one hold —
    // the second call must not skip b's turn straight to c
    releaseA();
    releaseA();

    const releaseB = await bPromise;
    await flushMicrotasks();
    expect(cGranted).toBe(false);

    releaseB();
    await flushMicrotasks();
    expect(cGranted).toBe(true);
  });

  it('keeps holds on different container elements independent', async () => {
    const containerA = document.createElement('div');
    const containerB = document.createElement('div');

    await acquireContainer(containerA, 'a');
    // must resolve without waiting for containerA's release
    const release = await acquireContainer(containerB, 'b');
    release();
  });
});
