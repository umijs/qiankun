/**
 * Values installed on a Compartment global at construction time.
 *
 * A non-null object with any PropertyDescriptor field (`value`, `writable`,
 * `get`, `set`, `configurable`, or `enumerable`) is interpreted as a
 * descriptor. Wrap a descriptor-shaped value in `{ value: yourValue }` when
 * the object itself should be exposed as the global value.
 */
export type CompartmentGlobals = Record<string, unknown>;

/** @deprecated Use CompartmentGlobals instead. */
export type Endowments = CompartmentGlobals;

export type CompartmentTransform = (source: string) => string;

export interface CompartmentOptions {
  name?: string;
  globals?: CompartmentGlobals;
  transforms?: CompartmentTransform[];
  /** qiankun host extension: the global object the membrane reads through to. */
  incubatorContext?: WindowProxy;
}

export interface EvaluateScriptOptions {
  sourceURL?: string;
}
