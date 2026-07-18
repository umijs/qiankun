import { afterEach, describe, expect, it, vi } from 'vitest';
import { Compartment, type CompartmentOptions } from '../../../index';
import { type MembraneTarget } from '../../membrane';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Compartment globals', () => {
  it('owns an isolated membrane global constructed from an options bag', () => {
    const sharedObject = { identity: true };
    const incubator = { hostOnly: 'host', sharedObject } as unknown as WindowProxy;
    const options: CompartmentOptions = {
      name: 'options-test',
      globals: { provided: 42 },
      incubatorContext: incubator,
    };
    const compartment = new Compartment(options);
    const view = compartment.globalThis as unknown as Record<string, unknown>;

    expect(compartment.name).toBe('options-test');
    expect(compartment.globalThis).not.toBe(incubator);
    expect(view.provided).toBe(42);
    expect(view.hostOnly).toBe('host');
    expect(view.sharedObject).toBe(sharedObject);

    view.localOnly = 'local';
    expect((incubator as unknown as Record<string, unknown>).localOnly).toBeUndefined();
  });

  it('defines unshadowable globals after construction', () => {
    const compartment = new Compartment();
    const customFetch = () => 'custom';
    let observedTarget: MembraneTarget | undefined;

    compartment.defineUnshadowableGlobals((rawTarget) => {
      observedTarget = rawTarget;
      return {
        self: { get: () => compartment.globalThis, configurable: false, enumerable: true },
        fetch: { value: customFetch, configurable: true, writable: true },
      };
    });

    expect(observedTarget).toBeDefined();
    expect(observedTarget).not.toBe(compartment.globalThis);
    expect(compartment.globalThis.self).toBe(compartment.globalThis);
    expect(compartment.globalThis.fetch).toBe(customFetch);
    expect(compartment.transformClassicScript('void self;')).toContain('const {self,fetch,');
  });

  it('exposes the host extensions without claiming unsupported SES APIs', () => {
    const compartment = new Compartment();

    // Deliberate SES/Layer-4 omissions — see docs/rfcs/compartment-alignment.md §5.
    (['evaluate', 'harden', 'lockdown'] as const).forEach((member) => {
      expect(member in compartment).toBe(false);
    });
    // qiankun host extensions layered around the Compartment-shaped core.
    expect(typeof compartment.evaluateScript).toBe('function');
    expect(typeof compartment.defineUnshadowableGlobals).toBe('function');
  });
});

describe('classic script execution', () => {
  it('applies transforms and resolves the compartment view at execution time', () => {
    const compartment = new Compartment({ transforms: [(source) => `${source}\ntransformed();`] });
    const source = compartment.transformClassicScript('original();', 'https://app.test/entry.js');

    expect(source).toContain('original();\ntransformed();');
    expect(source).toContain('//# sourceURL=https://app.test/entry.js');
    expect(source).toContain('window.__compartment_globalThis__');
    expect(source).toContain('if(!compartmentGlobalThis){return;}');
    expect(source).toContain('.call(compartmentGlobalThis)');
  });

  it('evaluates through a blob script and revokes its URL', async () => {
    let generatedBlob: Blob | undefined;
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      if (!(blob instanceof Blob)) throw new TypeError('Expected a Blob');
      generatedBlob = blob;
      return 'blob:compartment-test';
    });
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
      queueMicrotask(() => node.dispatchEvent(new Event('load')));
      return node;
    });
    const compartment = new Compartment({ transforms: [(source) => `${source}\ntransformed();`] });

    await compartment.evaluateScript('original();');

    expect(generatedBlob).toBeDefined();
    expect(await generatedBlob?.text()).toContain('original();\ntransformed();');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:compartment-test');
  });

  it('cancels pending execution and fails closed after disposal', async () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:pending-compartment-test');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(document.head, 'appendChild').mockImplementation((node) => node);
    const compartment = new Compartment({ name: 'pending-classic' });
    const evaluation = compartment.evaluateScript('window.shouldNotRun = true;');

    compartment.dispose();

    await expect(evaluation).rejects.toThrowError('was disposed before classic script evaluation completed');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:pending-compartment-test');
    expect(() => compartment.transformClassicScript('void 0;')).toThrowError('has been disposed');
  });
});
