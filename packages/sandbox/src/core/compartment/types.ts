import type { CompartmentModuleFacade, ImportHook, ModuleNamespace, Modules, ResolveHook } from '@qiankunjs/shared';

/**
 * Values installed on a Compartment global at construction time.
 *
 * A non-null object with any PropertyDescriptor field (`value`, `writable`,
 * `get`, `set`, `configurable`, or `enumerable`) is interpreted as a
 * descriptor. Wrap a descriptor-shaped value in `{ value: yourValue }` when
 * the object itself should be exposed as the global value.
 */
export type CompartmentGlobals = Record<string, unknown>;

export type CompartmentTransform = (source: string) => string;

/**
 * Structural host facade consumed by the streaming loader.
 *
 * HTML streaming must transform a classic script synchronously before its node
 * reaches the live DOM, so the asynchronous evaluateScript() host extension
 * cannot serve this boundary. A replacement Compartment mechanism implements
 * this adapter while loader remains independent of its concrete class.
 */
export interface CompartmentLoaderFacade extends CompartmentModuleFacade {
  readonly globalThis: WindowProxy;
  readonly latestSetProp: PropertyKey | undefined;
  transformClassicScript(source: string, sourceURL?: string): string;
}

/** qiankun host inputs used by the replaceable ESM mechanism. */
export interface CompartmentModuleHostOptions {
  entryUrl?: string;
  fetch?: typeof window.fetch;
  globalsBaseSet?: readonly string[];
  instanceId?: number;
  materializeRedirect?: (fullSpecifier: string) => string | undefined;
  isLifecycleNamespace?: (namespace: ModuleNamespace) => boolean;
  moduleImporter?: (moduleUrl: string) => Promise<ModuleNamespace>;
  createModuleUrl?: (code: string) => string;
  revokeModuleUrl?: (moduleUrl: string) => void;
}

export interface CompartmentOptions {
  name?: string;
  globals?: CompartmentGlobals;
  modules?: Modules;
  resolveHook?: ResolveHook;
  importHook?: ImportHook;
  /** Layer-4 terminology alias for importHook. */
  loadHook?: ImportHook;
  transforms?: CompartmentTransform[];
  /** qiankun host extension: the global object the membrane reads through to. */
  incubatorContext?: WindowProxy;
  /** qiankun host extension: browser loader inputs, not part of the SES-shaped surface. */
  moduleHost?: CompartmentModuleHostOptions;
}

export interface EvaluateScriptOptions {
  sourceURL?: string;
}
