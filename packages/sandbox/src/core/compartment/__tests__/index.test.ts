import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Compartment,
  type CompartmentLoaderFacade,
  type CompartmentOptions,
  type DocumentModule,
  type ModuleNamespace,
  type Sandbox,
} from '../../../index';
import { type MembraneTarget } from '../../membrane';

interface Layer4CompartmentShape {
  readonly name: string;
  readonly globalThis: WindowProxy;
  import(specifier: string): Promise<ModuleNamespace>;
  load(specifier: string): Promise<void>;
}

interface QiankunModuleFacadeShape extends Layer4CompartmentShape, CompartmentLoaderFacade {
  readonly latestSetProp: PropertyKey | undefined;
  evaluateScript(source: string, options?: { sourceURL?: string }): Promise<void>;
  getEsmGlobalsView(): Record<string, unknown>;
  onGlobalSet(listener: (property: PropertyKey) => void): () => void;
  registerDocumentModule(module: DocumentModule): void;
}

// Deliberate SES/Layer-4 omissions — see docs/rfcs/compartment-alignment.md §5.
// Kept test-local on purpose: the RFC is the single source of truth, so these lists
// must not leak into the package export surface as runtime constants.
const INTENTIONAL_OMISSIONS = ['evaluate', 'harden', 'lockdown'] as const;

// qiankun host extensions layered around the Compartment-shaped core.
const HOST_EXTENSIONS = [
  'DOM globals',
  'IsolationPlugin',
  'active',
  'defineUnshadowableGlobals',
  'dispose',
  'evaluateScript',
  'getEsmGlobalsView',
  'importDocumentModules',
  'inactive',
  'incubatorContext',
  'latestSetProp',
  'moduleHost',
  'onGlobalSet',
  'registerDocumentModule',
  'registerImportMap',
  'transformClassicScript',
  'type',
] as const;

type SpecCompartmentMember = 'globalThis' | 'import' | 'load' | 'name';
type LegacyCompartmentMember = 'addIntrinsics';
type ListedCompartmentHostMember = (typeof HOST_EXTENSIONS)[number];
type UnclassifiedCompartmentMember = Exclude<
  keyof Compartment,
  LegacyCompartmentMember | ListedCompartmentHostMember | SpecCompartmentMember
>;
type UnclassifiedSandboxMember = Exclude<keyof Sandbox, keyof Compartment | ListedCompartmentHostMember>;

const allCompartmentMembersAreClassified: [UnclassifiedCompartmentMember] extends [never] ? true : false = true;
const allSandboxMembersAreClassified: [UnclassifiedSandboxMember] extends [never] ? true : false = true;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('public API shape', () => {
  it('is structurally compatible with the Compartment facade and accepts the full options bag', async () => {
    const importHook = vi.fn(async () => ({ namespace: { fromHook: true } }));
    const options = {
      name: 'shape-test',
      globals: { configured: true },
      modules: { prebuilt: { namespace: { answer: 42 } } },
      resolveHook: (specifier: string, referrer: string) => new URL(specifier, referrer).href,
      importHook,
      transforms: [(source: string) => `${source}\n/* transformed */`],
      incubatorContext: window,
      moduleHost: {
        entryUrl: 'https://shape.test/index.html',
        fetch: window.fetch,
        globalsBaseSet: ['configured'],
        instanceId: 101,
        materializeRedirect: (specifier: string) =>
          specifier === 'https://shape.test/redirect.js' ? 'https://shape.test/target.js' : undefined,
        isLifecycleNamespace: (namespace: ModuleNamespace) => 'mount' in namespace,
        moduleImporter: async () => ({ imported: true }),
        createModuleUrl: () => 'blob:shape-test',
        revokeModuleUrl: () => {},
      },
    } satisfies CompartmentOptions;

    const compartment = new Compartment(options);
    const facade: QiankunModuleFacadeShape = compartment;

    expect(facade.name).toBe('shape-test');
    expect((facade.globalThis as unknown as Record<string, unknown>).configured).toBe(true);
    [
      'import',
      'load',
      'importDocumentModules',
      'registerDocumentModule',
      'registerImportMap',
      'transformClassicScript',
      'dispose',
    ].forEach((member) => {
      expect(Reflect.get(facade, member)).toBeTypeOf('function');
    });
    expect(await facade.importDocumentModules()).toBeUndefined();

    const layer4Alias = new Compartment({ loadHook: importHook } satisfies CompartmentOptions);
    compartment.dispose();
    layer4Alias.dispose();
  });

  it('keeps intentional omissions and every qiankun extension explicitly classified', () => {
    const compartment = new Compartment();

    // Deliberate SES/Layer-4 omissions — must never appear on the instance.
    INTENTIONAL_OMISSIONS.forEach((member) => {
      expect(member in compartment).toBe(false);
    });
    // qiankun host extensions layered around the Compartment-shaped core.
    expect(typeof compartment.evaluateScript).toBe('function');
    expect(typeof compartment.defineUnshadowableGlobals).toBe('function');
    expect(allCompartmentMembersAreClassified).toBe(true);
    expect(allSandboxMembersAreClassified).toBe(true);
    expect('addIntrinsics' in compartment).toBe(true);

    compartment.dispose();
  });
});

describe('Compartment options and global ownership', () => {
  it('creates and owns a distinct membrane global from an options bag', () => {
    const sharedObject = { identity: true };
    const incubator = {
      hostOnly: 'host',
      sharedObject,
    } as unknown as WindowProxy;
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
    expect(view.localOnly).toBe('local');
    expect((incubator as unknown as Record<string, unknown>).localOnly).toBeUndefined();
  });

  it('isolates writes between compartments while preserving host object identity', () => {
    const sharedObject = new Map<string, string>();
    const incubator = { sharedObject } as unknown as WindowProxy;
    const first = new Compartment({ incubatorContext: incubator });
    const second = new Compartment({ incubatorContext: incubator });
    const firstView = first.globalThis as unknown as Record<string, unknown>;
    const secondView = second.globalThis as unknown as Record<string, unknown>;

    firstView.answer = 42;

    expect(first.globalThis).not.toBe(second.globalThis);
    expect(secondView.answer).toBeUndefined();
    expect(firstView.sharedObject).toBe(sharedObject);
    expect(secondView.sharedObject).toBe(sharedObject);
    expect(firstView.sharedObject).toBeInstanceOf(Map);
  });

  it('distinguishes plain values from descriptor-shaped globals by the documented rule', () => {
    const plainObject = { nested: true };
    const descriptorShapedValue = { value: 'descriptor-result' };
    const options: CompartmentOptions = {
      incubatorContext: {} as WindowProxy,
      globals: {
        plainObject,
        descriptor: { value: 7, enumerable: true, writable: false, configurable: false },
        descriptorShapedValue,
        wrappedDescriptorShapedValue: {
          value: descriptorShapedValue,
          enumerable: true,
          writable: true,
          configurable: true,
        },
      },
    };

    const view = new Compartment(options).globalThis as unknown as Record<string, unknown>;

    expect(view.plainObject).toBe(plainObject);
    expect(view.descriptor).toBe(7);
    expect(view.descriptorShapedValue).toBe('descriptor-result');
    expect(view.wrappedDescriptorShapedValue).toBe(descriptorShapedValue);
    expect(Object.getOwnPropertyDescriptor(view, 'descriptor')).toMatchObject({
      enumerable: true,
      writable: false,
      configurable: false,
    });
  });
});

describe('two-stage unshadowable globals', () => {
  it('defines self references after construction and updates direct lookup and unscopables', () => {
    const compartment = new Compartment();
    const customFetch = () => 'custom';
    let observedTarget: MembraneTarget | undefined;

    expect((Reflect.get(compartment.globalThis, Symbol.unscopables) as Record<string, true>).eval).toBe(true);

    compartment.defineUnshadowableGlobals((rawTarget) => {
      observedTarget = rawTarget;
      return {
        self: { get: () => compartment.globalThis, configurable: false, enumerable: true },
        fetch: { value: customFetch, configurable: true, writable: true },
        eval: { value: customFetch, configurable: true, writable: true },
      };
    });

    const view = compartment.globalThis as unknown as Record<string, unknown>;
    expect(observedTarget).toBeDefined();
    expect(observedTarget).not.toBe(compartment.globalThis);
    expect(view.self).toBe(compartment.globalThis);
    expect(view.fetch).toBe(customFetch);
    expect(view.eval).toBe(customFetch);
    expect((Reflect.get(compartment.globalThis, Symbol.unscopables) as Record<string, true>).eval).toBeUndefined();
    expect(compartment.transformClassicScript('void self;')).toContain('const {self,fetch,');
  });
});

describe('host lifecycle facades', () => {
  it('exposes latest-set and modification subscription through Compartment', () => {
    const compartment = new Compartment();
    const listener = vi.fn();
    const unsubscribe = compartment.onGlobalSet(listener);
    const view = compartment.globalThis as unknown as Record<string, unknown>;

    view.runtimeFlag = true;
    expect(compartment.latestSetProp).toBe('runtimeFlag');
    expect(listener).toHaveBeenCalledWith('runtimeFlag');

    unsubscribe();
    view.afterUnsubscribe = true;
    expect(listener).toHaveBeenCalledTimes(1);
    expect(compartment.getEsmGlobalsView()).toBe(compartment.globalThis);
  });
});

describe('classic script evaluation', () => {
  it('keeps synchronous wrapping off the public instance API', () => {
    const compartment = new Compartment({ transforms: [(source) => `${source}\ntransformed();`] });
    const source = compartment.transformClassicScript('original();', 'https://app.test/entry.js');

    expect('makeEvaluateFactory' in compartment).toBe(false);
    expect(source).toContain('original();\ntransformed();');
    expect(source).toContain('//# sourceURL=https://app.test/entry.js');
    expect(source).toContain('window.__compartment_globalThis__');
    expect(source).toContain('if(!compartmentGlobalThis){return;}');
    expect(source).toContain('.call(compartmentGlobalThis)');
    expect(source).not.toContain('.bind(window.');
  });

  it('evaluates with a blob script and never builds an eval or Function path', async () => {
    let generatedBlob: Blob | undefined;
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      if (!(blob instanceof Blob)) {
        throw new TypeError('Expected evaluateScript to create a Blob URL');
      }
      generatedBlob = blob;
      return 'blob:compartment-test';
    });
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const appendChild = vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
      queueMicrotask(() => node.dispatchEvent(new Event('load')));
      return node;
    });
    const compartment = new Compartment({ transforms: [(source) => `${source}\ntransformed();`] });

    await compartment.evaluateScript('original();', { sourceURL: 'https://app.test/entry.js' });

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(appendChild).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:compartment-test');
    expect(generatedBlob).toBeDefined();
    const generatedSource = await generatedBlob!.text();
    expect(generatedSource).toContain('original();\ntransformed();');
    expect(generatedSource).not.toMatch(/\beval\s*\(|new Function/);
  });

  it('cancels a queued classic evaluation when the compartment is disposed', async () => {
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:pending-compartment-test');
    const appendChild = vi.spyOn(document.head, 'appendChild').mockImplementation((node) => node);
    const compartment = new Compartment({ name: 'pending-classic' });

    const evaluation = compartment.evaluateScript('window.shouldNotRun = true;');
    const rejection = expect(evaluation).rejects.toThrowError(
      'was disposed before classic script evaluation completed',
    );
    compartment.dispose();

    await rejection;
    expect(appendChild).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:pending-compartment-test');

    const script = appendChild.mock.calls[0][0] as HTMLScriptElement;
    expect(script.onload).toBeNull();
    expect(script.onerror).toBeNull();
  });
});

describe('terminal disposal', () => {
  it('is idempotent and rejects every module or evaluation operation after disposal', async () => {
    const createModuleUrl = vi.fn(() => 'blob:terminal-compartment');
    const revokeModuleUrl = vi.fn();
    const compartment = new Compartment({
      name: 'terminal',
      moduleHost: {
        createModuleUrl,
        revokeModuleUrl,
      },
    });
    compartment.registerImportMap('{"imports":{}}', document.baseURI);

    compartment.dispose();
    compartment.dispose();

    expect(createModuleUrl).toHaveBeenCalledOnce();
    expect(revokeModuleUrl).toHaveBeenCalledOnce();
    expect(() => compartment.import('./entry.js')).toThrowError('has been disposed');
    expect(() => compartment.load('./entry.js')).toThrowError('has been disposed');
    expect(() => compartment.importDocumentModules()).toThrowError('has been disposed');
    expect(() =>
      compartment.registerDocumentModule({ code: 'export default true;', baseUrl: document.baseURI }),
    ).toThrowError('has been disposed');
    expect(() => compartment.registerImportMap('{"imports":{}}', document.baseURI)).toThrowError('has been disposed');
    expect(() => compartment.transformClassicScript('void 0;')).toThrowError('has been disposed');
    await expect(compartment.evaluateScript('void 0;')).rejects.toThrowError('has been disposed');
    expect(createModuleUrl).toHaveBeenCalledOnce();
  });
});
