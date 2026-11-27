import {
  EsmSandboxEngine,
  QiankunError,
  type DocumentModule,
  type ModuleNamespace,
  esmInternalPrefix,
} from '@qiankunjs/shared';
import { nativeDocument, nativeGlobal } from '../../consts';
import { markNodeForNativePassthrough } from '../nativePassthrough';
import { esmDestructurableGlobals } from '../esm-globals';
import {
  classicScriptBody,
  defaultClassicGlobalNames,
  type ClassicScriptFactory,
  type ClassicScriptPreparation,
} from './classic-script';
export {
  precompileScriptSource,
  type ScriptSource,
  type ClassicScriptFactory,
  type ClassicScriptPreparation,
} from './classic-script';
import { Membrane, type MembraneTarget } from '../membrane';
import { array2TruthyObject } from '../utils';
import {
  type CompartmentLoaderFacade,
  type CompartmentOptions,
  type CompartmentTransform,
  type EvaluateScriptOptions,
} from './types';

export {
  type CompartmentOptions,
  type CompartmentLoaderFacade,
  type CompartmentModuleHostOptions,
  type EvaluateScriptOptions,
  type CompartmentGlobals,
  type CompartmentTransform,
} from './types';

const compartmentGlobalIdPrefix = '__compartment_globalThis__';
const compartmentGlobalIdSuffix = '__';
const getCompartmentGlobalId = (id: number): CompartmentGlobalId =>
  `${compartmentGlobalIdPrefix}${String(id)}${compartmentGlobalIdSuffix}`;
type CompartmentGlobalId = `${typeof compartmentGlobalIdPrefix}${string}${typeof compartmentGlobalIdSuffix}`;

type PendingClassicEvaluation = {
  cancel: () => void;
};

const defaultUnshadowableGlobalNames = defaultClassicGlobalNames;

declare global {
  interface Window {
    [p: CompartmentGlobalId]: WindowProxy | undefined;
  }
}

export type UnshadowableGlobals =
  Record<string, PropertyDescriptor> | ((rawTarget: MembraneTarget) => Record<string, PropertyDescriptor>);

let compartmentCounter = 0;

export class Compartment implements CompartmentLoaderFacade {
  /**
   * Since browser script execution is scheduled by the host, every compartment
   * needs a stable, unique global accessor for its generated classic scripts.
   */
  private readonly id: CompartmentGlobalId;

  private readonly membrane: Membrane;

  private readonly transforms: CompartmentTransform[];

  private classicPreparation: ClassicScriptPreparation | undefined;

  private readonly preparedCalls = new Map<number, ClassicScriptFactory>();

  private preparedCallCounter = 0;

  private readonly classicBridge: string;

  private readonly unscopables: Record<string, true>;

  private moduleEngineOptions: ConstructorParameters<typeof EsmSandboxEngine>[0] | undefined;

  private moduleEngine: EsmSandboxEngine | undefined;

  private disposed = false;

  private unsafeClassicEvaluationWarned = false;

  private readonly pendingClassicEvaluations = new Set<PendingClassicEvaluation>();

  private unshadowableGlobalNames = defaultUnshadowableGlobalNames.slice();

  private readonly definedUnshadowableGlobalNames = new Set<string>();

  readonly name: string;

  constructor(options: CompartmentOptions = {}) {
    const {
      name = '',
      globals = {},
      modules,
      resolveHook,
      importHook,
      loadHook,
      transforms = [],
      classicPreparation,
      incubatorContext = window,
      moduleHost = {},
    } = options;
    this.name = name;
    this.transforms = transforms.slice();
    this.classicPreparation = classicPreparation;
    this.unscopables = array2TruthyObject(defaultUnshadowableGlobalNames);
    this.membrane = new Membrane(incubatorContext, this.unscopables, { globals });

    // make sure the compartment global accessor is unique
    while (nativeGlobal[getCompartmentGlobalId(compartmentCounter)]) {
      compartmentCounter++;
    }
    const compartmentId = compartmentCounter++;
    this.id = getCompartmentGlobalId(compartmentId);
    nativeGlobal[this.id] = this.membrane.globalThisView;
    // Use the existing shielded internal namespace. Application globals cannot read this bridge.
    this.classicBridge = `${esmInternalPrefix}classic_${this.id}${classicPreparation ? `_${nativeGlobal.crypto.getRandomValues(new Uint32Array(4)).join('_')}` : ''}`;
    if (classicPreparation)
      Object.defineProperty(nativeGlobal, this.classicBridge, {
        configurable: true,
        value: (token: number) => {
          this.assertAlive();
          const factory = this.preparedCalls.get(token);
          this.preparedCalls.delete(token);
          if (factory) factory(this.globalThis).call(this.globalThis);
        },
      });

    const defaultFetch = nativeGlobal.fetch.bind(nativeGlobal);
    const {
      entryUrl = nativeDocument.baseURI,
      fetch = defaultFetch,
      globalsBaseSet = esmDestructurableGlobals,
      instanceId = compartmentId + 1,
      materializeRedirect,
      isLifecycleNamespace,
      moduleImporter,
      createModuleUrl,
      revokeModuleUrl,
    } = moduleHost;
    this.moduleEngineOptions = {
      appName: name || `compartment-${String(compartmentId)}`,
      instanceId,
      entryUrl,
      fetch,
      getGlobalsView: () => this.getEsmGlobalsView(),
      globalsBaseSet: Array.from(new Set([...globalsBaseSet, ...Object.keys(globals)])),
      modules,
      resolveHook,
      importHook,
      loadHook,
      materializeRedirect,
      isLifecycleNamespace,
      moduleImporter,
      createModuleUrl,
      revokeModuleUrl,
      subscribeGlobalSets: (listener) => this.onGlobalSet(listener),
    };
  }

  get globalThis(): WindowProxy {
    return this.membrane.globalThisView;
  }

  get latestSetProp(): PropertyKey | undefined {
    return this.membrane.latestSetProp;
  }

  /** qiankun host extension for installing globals that app code must not shadow. */
  defineUnshadowableGlobals(globals: UnshadowableGlobals): void {
    this.assertAlive();
    const names = this.membrane.defineUnshadowableGlobals(globals);
    const newlyDefinedNames = names.filter((name) => !this.definedUnshadowableGlobalNames.has(name));
    const newlyDefinedNameSet = new Set(newlyDefinedNames);

    names.forEach((name) => {
      delete this.unscopables[name];
      this.definedUnshadowableGlobalNames.add(name);
    });
    this.unshadowableGlobalNames = newlyDefinedNames.concat(
      this.unshadowableGlobalNames.filter((name) => !newlyDefinedNameSet.has(name)),
    );
  }

  /** Membrane-backed globals view used by the ESM top-of-module injection. */
  getEsmGlobalsView(): Record<string, unknown> {
    return this.globalThis as unknown as Record<string, unknown>;
  }

  /** Subscribe to global modifications made through this compartment. */
  onGlobalSet(listener: (p: PropertyKey) => void): () => void {
    this.assertAlive();
    return this.membrane.onModification(listener);
  }

  /**
   * Evaluate a classic script without relying on eval or Function construction.
   * Resolution only indicates that the browser finished executing the blob script.
   */
  async evaluateScript(source: string, options: EvaluateScriptOptions = {}): Promise<void> {
    let releasePrepared = () => {};
    const code = this.transformClassicScript(source, options.sourceURL, (cleanup) => {
      releasePrepared = cleanup;
    });
    this.warnAboutUnsafeClassicSelfReference();
    const script = nativeDocument.createElement('script');
    let blobUrl: string;
    try {
      blobUrl = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
    } catch (error) {
      releasePrepared();
      throw error;
    }

    // The script is already transformed. Prevent the dynamic-append pipeline from
    // fetching and wrapping this internal blob a second time.
    markNodeForNativePassthrough(script);
    script.async = false;

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const pending: PendingClassicEvaluation = {
        cancel: () => {},
      };
      const cleanup = () => {
        this.pendingClassicEvaluations.delete(pending);
        releasePrepared();
        script.onload = null;
        script.onerror = null;
        script.remove();
        URL.revokeObjectURL(blobUrl);
      };

      const settle = (callback: () => void) => {
        if (settled) return;
        settled = true;
        cleanup();
        callback();
      };

      pending.cancel = () => {
        settle(() =>
          reject(
            new QiankunError(
              `Compartment ${this.name || '(anonymous)'} was disposed before classic script evaluation completed`,
              'compartment-disposed',
            ),
          ),
        );
      };
      this.pendingClassicEvaluations.add(pending);

      script.onload = () => {
        settle(resolve);
      };
      script.onerror = () => {
        settle(() =>
          reject(new Error(`Failed to evaluate classic script${options.sourceURL ? ` ${options.sourceURL}` : ''}`)),
        );
      };
      script.src = blobUrl;

      try {
        this.globalThis.document.head.appendChild(script);
      } catch (error) {
        settle(() => reject(error instanceof Error ? error : new Error(String(error))));
      }
    });
  }

  import(specifier: string): Promise<ModuleNamespace> {
    return this.getModuleEngine().import(specifier);
  }

  load(specifier: string): Promise<void> {
    return this.getModuleEngine().load(specifier);
  }

  importDocumentModules(): Promise<ModuleNamespace | undefined> {
    this.assertAlive();
    return this.moduleEngine?.importDocumentModules() ?? Promise.resolve(undefined);
  }

  registerDocumentModule(module: DocumentModule): void {
    this.getModuleEngine().registerDocumentModule(module);
  }

  registerImportMap(mapText: string, baseUrl: string): void {
    this.getModuleEngine().registerImportMap(mapText, baseUrl);
  }

  /**
   * Permanently revoke global views and release module, hook, and host references. Transpiled DOM
   * assets keyed by this compartment belong to the host that transpiled them and are not released here.
   */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    // Revoke the generated-script receiver first: even if later cleanup fails,
    // already queued classic scripts can no longer fall through to the host global.
    delete nativeGlobal[this.id];
    Reflect.deleteProperty(nativeGlobal, this.classicBridge);
    this.preparedCalls.clear();
    this.classicPreparation = undefined;
    Array.from(this.pendingClassicEvaluations).forEach(({ cancel }) => cancel());
    this.pendingClassicEvaluations.clear();
    try {
      this.moduleEngine?.dispose();
    } finally {
      this.moduleEngine = undefined;
      this.moduleEngineOptions = undefined;
      this.transforms.length = 0;
      this.unshadowableGlobalNames = [];
      this.definedUnshadowableGlobalNames.clear();
      Object.keys(this.unscopables).forEach((key) => delete this.unscopables[key]);
      this.membrane.dispose();
    }
  }

  /**
   * Synchronous host adapter used while the HTML loader transforms a detached
   * script node. Unlike evaluateScript(), this prepares code without scheduling
   * a second script element.
   */
  transformClassicScript(source: string, sourceURL?: string, registerCleanup?: (cleanup: () => void) => void): string {
    this.assertAlive();
    return this.prepareClassicScript(source, sourceURL, registerCleanup);
  }

  protected lockGlobalThis(): void {
    this.membrane.lock();
  }

  protected unlockGlobalThis(): void {
    this.assertAlive();
    this.membrane.unlock();
  }

  protected get globalModifications(): ReadonlySet<PropertyKey> {
    return this.membrane.modifications;
  }

  private prepareClassicScript(
    source: string,
    sourceURL?: string,
    registerCleanup?: (cleanup: () => void) => void,
  ): string {
    const transformedSource = this.transforms.reduce((result, transform) => transform(result), source);
    const prepared =
      this.transforms.length === 0 && sourceURL
        ? this.classicPreparation?.get(source, sourceURL, this.unshadowableGlobalNames)
        : undefined;
    if (prepared) {
      const token = this.preparedCallCounter++;
      this.preparedCalls.set(token, prepared);
      registerCleanup?.(() => {
        this.preparedCalls.delete(token);
      });
      // The bridge pins only this queued evaluation. Cache disposal cannot invalidate a script
      // already scheduled by the loader; compartment disposal clears both bridge and pins.
      return `;(function(view){if(view&&typeof window[${JSON.stringify(this.classicBridge)}]==='function'){window[${JSON.stringify(this.classicBridge)}](${String(token)});}})(window.${this.id});`;
    }
    // Resolve the receiver before entering with: a missing receiver must never become the host.
    return `;(function(compartmentGlobalThis){if(!compartmentGlobalThis){return;}(function(){${classicScriptBody(transformedSource, sourceURL, this.unshadowableGlobalNames)}}).call(compartmentGlobalThis);})(window.${this.id});`;
  }

  private getModuleEngine(): EsmSandboxEngine {
    this.assertAlive();
    this.moduleEngine ??= new EsmSandboxEngine(this.moduleEngineOptions!);
    return this.moduleEngine;
  }

  private warnAboutUnsafeClassicSelfReference(): void {
    if (process.env.NODE_ENV !== 'development' || this.unsafeClassicEvaluationWarned) return;

    const hasWindowSelfReference =
      this.definedUnshadowableGlobalNames.has('window') && this.globalThis.window === this.globalThis;
    if (!hasWindowSelfReference) {
      this.unsafeClassicEvaluationWarned = true;
      console.warn(
        `[qiankun:sandbox] Compartment ${
          this.name || '(anonymous)'
        } evaluates classic scripts without an isolated window self-reference. Use StandardSandbox for classic script evaluation.`,
      );
    }
  }

  private assertAlive(): void {
    if (this.disposed) {
      throw new QiankunError(`Compartment ${this.name || '(anonymous)'} has been disposed`, 'compartment-disposed');
    }
  }
}
