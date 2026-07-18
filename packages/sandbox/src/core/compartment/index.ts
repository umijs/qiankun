import { markLoaderStreamedNode, QiankunError } from '@qiankunjs/shared';
import { nativeDocument, nativeGlobal } from '../../consts';
import { globalsInES2015 } from '../globals';
import { Membrane, type MembraneTarget } from '../membrane';
import { array2TruthyObject } from '../utils';
import { type CompartmentOptions, type CompartmentTransform, type EvaluateScriptOptions } from './types';

export {
  type CompartmentOptions,
  type EvaluateScriptOptions,
  type CompartmentGlobals,
  type Endowments,
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

const defaultUnshadowableGlobalNames = globalsInES2015.concat(['requestAnimationFrame', 'cancelAnimationFrame']);

declare global {
  interface Window {
    [p: CompartmentGlobalId]: WindowProxy | undefined;
  }
}

export type UnshadowableGlobals =
  Record<string, PropertyDescriptor> | ((rawTarget: MembraneTarget) => Record<string, PropertyDescriptor>);

let compartmentCounter = 0;

export class Compartment {
  /**
   * Since browser script execution is scheduled by the host, every compartment
   * needs a stable, unique global accessor for its generated classic scripts.
   */
  private readonly id: CompartmentGlobalId;

  private readonly membrane: Membrane;

  private readonly transforms: CompartmentTransform[];

  private readonly unscopables: Record<string, true>;

  private disposed = false;

  private unsafeClassicEvaluationWarned = false;

  private readonly pendingClassicEvaluations = new Set<PendingClassicEvaluation>();

  private unshadowableGlobalNames = defaultUnshadowableGlobalNames.slice();

  private readonly definedUnshadowableGlobalNames = new Set<string>();

  readonly name: string;

  constructor(options: CompartmentOptions = {}) {
    const { name = '', globals = {}, transforms = [], incubatorContext = window } = options;
    this.name = name;
    this.transforms = transforms.slice();
    this.unscopables = array2TruthyObject(defaultUnshadowableGlobalNames);
    this.membrane = new Membrane(incubatorContext, this.unscopables, { globals });

    // make sure the compartment global accessor is unique
    while (nativeGlobal[getCompartmentGlobalId(compartmentCounter)]) {
      compartmentCounter++;
    }
    this.id = getCompartmentGlobalId(compartmentCounter++);
    nativeGlobal[this.id] = this.membrane.globalThisView;
  }

  get globalThis(): WindowProxy {
    return this.membrane.globalThisView;
  }

  get latestSetProp(): PropertyKey | undefined {
    return this.membrane.latestSetProp;
  }

  /** qiankun host extension for installing globals that app code must not shadow. */
  defineUnshadowableGlobals(globals: UnshadowableGlobals): void {
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

  /** @deprecated Use defineUnshadowableGlobals instead. */
  addIntrinsics(globals: UnshadowableGlobals): void {
    this.defineUnshadowableGlobals(globals);
  }

  /** Membrane-backed globals view used by the ESM top-of-module injection. */
  getEsmGlobalsView(): Record<string, unknown> {
    return this.globalThis as unknown as Record<string, unknown>;
  }

  /** Subscribe to global modifications made through this compartment. */
  onGlobalSet(listener: (p: PropertyKey) => void): () => void {
    return this.membrane.onModification(listener);
  }

  /**
   * Evaluate a classic script without relying on eval or Function construction.
   * Resolution only indicates that the browser finished executing the blob script.
   */
  async evaluateScript(source: string, options: EvaluateScriptOptions = {}): Promise<void> {
    const code = this.transformClassicScript(source, options.sourceURL);
    this.warnAboutUnsafeClassicSelfReference();
    const script = nativeDocument.createElement('script');
    const blobUrl = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));

    // The script is already transformed. Prevent the dynamic-append pipeline from
    // fetching and wrapping this internal blob a second time.
    markLoaderStreamedNode(script);
    script.async = false;

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const pending: PendingClassicEvaluation = {
        cancel: () => {},
      };
      const cleanup = () => {
        this.pendingClassicEvaluations.delete(pending);
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

  /** Release this compartment and its host-global bridge. */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    // Revoke the generated-script receiver first: even if later cleanup fails,
    // already queued classic scripts can no longer fall through to the host global.
    delete nativeGlobal[this.id];
    Array.from(this.pendingClassicEvaluations).forEach(({ cancel }) => cancel());
    this.pendingClassicEvaluations.clear();
  }

  /**
   * Synchronous host adapter used while the HTML loader transforms a detached
   * script node. Unlike evaluateScript(), this prepares code without scheduling
   * a second script element.
   */
  transformClassicScript(source: string, sourceURL?: string): string {
    this.assertAlive();
    return this.prepareClassicScript(source, sourceURL);
  }

  /** @deprecated Use transformClassicScript instead. */
  makeEvaluateFactory(source: string, sourceURL?: string): string {
    return this.transformClassicScript(source, sourceURL);
  }

  protected lockGlobalThis(): void {
    this.membrane.lock();
  }

  protected unlockGlobalThis(): void {
    this.membrane.unlock();
  }

  protected get globalModifications(): ReadonlySet<PropertyKey> {
    return this.membrane.modifications;
  }

  private prepareClassicScript(source: string, sourceURL?: string): string {
    const transformedSource = this.transforms.reduce((result, transform) => transform(result), source);
    const sourceMapURL = sourceURL ? `//# sourceURL=${sourceURL}\n` : '';
    const globalObjectOptimizer = this.unshadowableGlobalNames.length
      ? `const {${this.unshadowableGlobalNames.join(',')}} = this;`
      : '';

    // Resolve the compartment view before entering the non-strict `with` wrapper. Calling that
    // wrapper with an absent receiver would coerce `this` to the real window, so disposal must
    // fail closed for scripts the browser had already queued.
    // eslint-disable-next-line max-len
    return `;(function(compartmentGlobalThis){if(!compartmentGlobalThis){return;}(function(){with(this){${globalObjectOptimizer}${transformedSource}\n${sourceMapURL}}}).call(compartmentGlobalThis);})(window.${this.id});`;
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
      throw new QiankunError(`Compartment ${this.name || '(anonymous)'} has been disposed`);
    }
  }
}
