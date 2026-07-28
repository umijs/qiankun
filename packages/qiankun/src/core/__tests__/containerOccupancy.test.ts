/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import { acquireContainer, isContainerHeld } from '../containerOccupancy';

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve));

describe('container occupancy gate', () => {
  it('grants an uncontended container immediately', async () => {
    const container = document.createElement('div');
    const hold = await acquireContainer(container, 'a');
    hold.release();

    // a released container is immediately acquirable again
    const holdAgain = await acquireContainer(container, 'a');
    holdAgain.release();
  });

  it('serializes contending holders FIFO', async () => {
    const container = document.createElement('div');
    const grantOrder: string[] = [];

    const holdA = await acquireContainer(container, 'a');
    const bPromise = acquireContainer(container, 'b').then((hold) => {
      grantOrder.push('b');
      return hold;
    });
    const cPromise = acquireContainer(container, 'c').then((hold) => {
      grantOrder.push('c');
      return hold;
    });

    await flushMicrotasks();
    expect(grantOrder).toEqual([]);

    holdA.release();
    const holdB = await bPromise;
    await flushMicrotasks();
    expect(grantOrder).toEqual(['b']);

    holdB.release();
    const holdC = await cPromise;
    expect(grantOrder).toEqual(['b', 'c']);
    holdC.release();
  });

  it('ignores duplicate releases of one hold', async () => {
    const container = document.createElement('div');
    const holdA = await acquireContainer(container, 'a');
    const bPromise = acquireContainer(container, 'b');
    let cGranted = false;
    void acquireContainer(container, 'c').then((hold) => {
      cGranted = true;
      hold.release();
    });

    // the failure fallback and the regular release point may both fire for one hold —
    // the second call must not skip b's turn straight to c
    holdA.release();
    holdA.release();

    const holdB = await bPromise;
    await flushMicrotasks();
    expect(cGranted).toBe(false);

    holdB.release();
    await flushMicrotasks();
    expect(cGranted).toBe(true);
  });

  it('keeps holds on different container elements independent', async () => {
    const containerA = document.createElement('div');
    const containerB = document.createElement('div');

    await acquireContainer(containerA, 'a');
    // must resolve without waiting for containerA's release
    const hold = await acquireContainer(containerB, 'b');
    hold.release();
  });

  it('flips the held query exactly once, on release', async () => {
    const container = document.createElement('div');
    const hold = await acquireContainer(container, 'a');
    expect(hold.held).toBe(true);

    hold.release();
    expect(hold.held).toBe(false);

    // held stays false for this hold even after the container is re-acquired by another
    const holdAgain = await acquireContainer(container, 'b');
    expect(hold.held).toBe(false);
    expect(holdAgain.held).toBe(true);
    holdAgain.release();
  });

  it('exposes container occupancy through the isContainerHeld peek', async () => {
    const container = document.createElement('div');
    expect(isContainerHeld(container)).toBe(false);

    const hold = await acquireContainer(container, 'a');
    expect(isContainerHeld(container)).toBe(true);

    // a queued waiter keeps the container held across the handoff
    const bPromise = acquireContainer(container, 'b');
    hold.release();
    expect(isContainerHeld(container)).toBe(true);

    (await bPromise).release();
    expect(isContainerHeld(container)).toBe(false);
  });
});
