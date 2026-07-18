import { describe, expect, it } from 'vitest';
import { Membrane } from '..';

function createCountedGlobal() {
  const rawGlobal: Record<string, unknown> = {};
  for (let index = 0; index < 128; index++) {
    rawGlobal[`configurable${index}`] = index;
  }
  Object.defineProperties(rawGlobal, {
    locked: {
      configurable: false,
      enumerable: true,
      value: 'host',
      writable: false,
    },
    lockedGetter: {
      configurable: false,
      enumerable: true,
      get() {
        return this.marker;
      },
    },
    lockedWritable: {
      configurable: false,
      enumerable: true,
      value: 'host',
      writable: true,
    },
    marker: {
      configurable: true,
      enumerable: true,
      value: 'host-marker',
      writable: true,
    },
  });

  let descriptorReads = 0;
  const globalContext = new Proxy(rawGlobal, {
    getOwnPropertyDescriptor(target, property) {
      descriptorReads++;
      return Reflect.getOwnPropertyDescriptor(target, property);
    },
  });

  return {
    getDescriptorReads: () => descriptorReads,
    globalContext: globalContext as unknown as WindowProxy,
    rawGlobal,
  };
}

describe('non-configurable global properties', () => {
  it('materializes host descriptors only when proxy invariants require them', () => {
    const { getDescriptorReads, globalContext } = createCountedGlobal();
    const membrane = new Membrane(globalContext, {});

    expect(getDescriptorReads()).toBe(0);
    expect(Object.prototype.hasOwnProperty.call(membrane.target, 'locked')).toBe(false);
    expect(Reflect.ownKeys(membrane.realmGlobal)).toContain('locked');
    expect(getDescriptorReads()).toBe(0);

    expect(Object.getOwnPropertyDescriptor(membrane.realmGlobal, 'locked')).toEqual({
      configurable: false,
      enumerable: true,
      value: 'host',
      writable: false,
    });
    expect(Object.prototype.hasOwnProperty.call(membrane.target, 'locked')).toBe(true);
  });

  it('keeps non-configurable data and accessor behavior after lazy materialization', () => {
    const { globalContext, rawGlobal } = createCountedGlobal();
    const membrane = new Membrane(globalContext, {});
    const proxy = membrane.realmGlobal as unknown as Record<string, unknown>;

    expect(proxy.lockedGetter).toBe('host-marker');
    expect(Object.prototype.hasOwnProperty.call(membrane.target, 'lockedGetter')).toBe(false);
    expect(Object.getOwnPropertyDescriptor(proxy, 'lockedGetter')?.configurable).toBe(false);
    expect(proxy.lockedGetter).toBe('host-marker');

    expect(Reflect.set(proxy, 'lockedWritable', 'sandbox')).toBe(true);
    expect(proxy.lockedWritable).toBe('sandbox');
    expect(rawGlobal.lockedWritable).toBe('host');

    expect(() => Object.defineProperty(proxy, 'locked', { value: 'sandbox' })).toThrow(TypeError);
    expect(proxy.locked).toBe('host');
    expect(() => Reflect.deleteProperty(proxy, 'locked')).toThrow(TypeError);
  });

  it('supports descriptor enumeration without violating proxy invariants', () => {
    const { globalContext } = createCountedGlobal();
    const membrane = new Membrane(globalContext, {});

    expect(Object.getOwnPropertyNames(membrane.realmGlobal)).toContain('locked');
    expect(Object.getOwnPropertyDescriptors(membrane.realmGlobal).locked).toEqual({
      configurable: false,
      enumerable: true,
      value: 'host',
      writable: false,
    });
  });

  it('never materializes a shielded internal key on set, keeping the host accessor unreachable', () => {
    const rawGlobal: Record<string, unknown> = {};
    const hostAccessor = () => 'host-realm-accessor';
    Object.defineProperty(rawGlobal, '__qk_r_test', {
      configurable: false,
      enumerable: false,
      value: hostAccessor,
      writable: false,
    });
    const membrane = new Membrane(rawGlobal as unknown as WindowProxy, {});
    const proxy = membrane.realmGlobal as unknown as Record<string, unknown>;

    // shielded before any write
    expect(proxy.__qk_r_test).toBeUndefined();
    expect('__qk_r_test' in proxy).toBe(false);

    // a write behaves like defining a brand-new app-own global rather than
    // copying the non-configurable host descriptor onto the target
    proxy.__qk_r_test = 'sandbox-own';

    expect(proxy.__qk_r_test).toBe('sandbox-own');
    expect(Object.getOwnPropertyDescriptor(membrane.target, '__qk_r_test')?.configurable).toBe(true);
    expect(rawGlobal.__qk_r_test).toBe(hostAccessor);
  });

  it('keeps endowments ahead of the host global without scanning host descriptors', () => {
    const { getDescriptorReads, globalContext } = createCountedGlobal();
    const membrane = new Membrane(
      globalContext,
      {},
      {
        endowments: {
          locked: {
            configurable: false,
            enumerable: true,
            value: 'endowment',
            writable: false,
          },
        },
      },
    );

    expect(getDescriptorReads()).toBe(0);
    expect((membrane.realmGlobal as unknown as Record<string, unknown>).locked).toBe('endowment');
    expect(getDescriptorReads()).toBe(0);
  });
});
