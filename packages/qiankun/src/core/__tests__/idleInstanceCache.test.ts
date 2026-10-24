import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IdleInstanceCache } from '../idleInstanceCache';

describe('IdleInstanceCache', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('bounds the global idle pool and promotes reused instances to most recently used', () => {
    const evict = vi.fn();
    const cache = new IdleInstanceCache(evict, { maxIdle: 2, maxIdlePerApp: 2, idleTTL: 100 });
    const a = { name: 'a', entry: '/a' },
      b = { name: 'b', entry: '/b' },
      c = { name: 'c', entry: '/c' };
    cache.add(a);
    cache.add(b);
    cache.delete(a);
    cache.add(a);
    cache.add(c);
    expect(evict).toHaveBeenCalledExactlyOnceWith(b);
  });

  it('bounds each name and entry independently without combining strings into a key', () => {
    const evict = vi.fn();
    const cache = new IdleInstanceCache(evict, { maxIdle: 8, maxIdlePerApp: 1, idleTTL: 100 });
    const a = { name: 'app', entry: '/v1' },
      b = { ...a };
    cache.add(a);
    cache.add({ name: 'app', entry: '/v2' });
    cache.add({ name: 'other', entry: '/v1' });
    cache.add(b);
    expect(evict).toHaveBeenCalledExactlyOnceWith(a);
  });

  it('expires idle instances without requiring another load', async () => {
    const evict = vi.fn();
    const cache = new IdleInstanceCache(evict, { maxIdle: 8, maxIdlePerApp: 2, idleTTL: 100 });
    const a = { name: 'app', entry: '/v1' };
    cache.add(a);
    await vi.advanceTimersByTimeAsync(99);
    expect(evict).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(evict).toHaveBeenCalledExactlyOnceWith(a);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels expiry during reuse and starts a fresh idle period on return', async () => {
    const evict = vi.fn();
    const cache = new IdleInstanceCache(evict, { maxIdle: 8, maxIdlePerApp: 2, idleTTL: 100 });
    const a = { name: 'app', entry: '/v1' };
    cache.add(a);
    await vi.advanceTimersByTimeAsync(90);
    cache.delete(a);
    await vi.advanceTimersByTimeAsync(200);
    expect(evict).not.toHaveBeenCalled();
    cache.add(a);
    cache.add(a); // checking idle state repeatedly must not renew its TTL
    await vi.advanceTimersByTimeAsync(100);
    expect(evict).toHaveBeenCalledExactlyOnceWith(a);
  });
});
