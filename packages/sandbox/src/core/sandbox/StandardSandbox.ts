import { hasOwnProperty } from '@qiankunjs/shared';
import { Compartment, type CompartmentGlobals, type CompartmentOptions } from '../compartment';
import { type MembraneTarget } from '../membrane';
import { type Sandbox, SandboxType } from './types';

const standardUnshadowableGlobalNames = [
  'window',
  'self',
  'globalThis',
  'hasOwnProperty',
  'eval',
  'top',
  'parent',
  'document',
];

const testOnlyUnshadowableGlobalNames = ['mockSafariTop', 'mockTop', 'mockGlobalThis'];

const omitReservedGlobals = (globals: CompartmentGlobals): CompartmentGlobals => {
  const reservedNames = new Set(
    standardUnshadowableGlobalNames.concat(process.env.NODE_ENV === 'test' ? testOnlyUnshadowableGlobalNames : []),
  );
  return Object.fromEntries(Object.entries(globals).filter(([name]) => !reservedNames.has(name)));
};

export class StandardSandbox extends Compartment implements Sandbox {
  readonly type = SandboxType.Standard;

  constructor(
    name: string,
    globals: CompartmentGlobals = {},
    incubatorContext: WindowProxy = window,
    options: Omit<CompartmentOptions, 'globals' | 'incubatorContext' | 'name'> = {},
  ) {
    super({
      ...options,
      name,
      globals: omitReservedGlobals(globals),
      incubatorContext,
    });

    this.defineUnshadowableGlobals((rawTarget) => this.createStandardGlobals(rawTarget, incubatorContext));
  }

  active(): void {
    this.unlockGlobalThis();
  }

  inactive(): void {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
        ...this.globalModifications.keys(),
      ]);
    }

    this.lockGlobalThis();
  }

  private createStandardGlobals(
    rawTarget: MembraneTarget,
    incubatorContext: WindowProxy,
  ): Record<string, PropertyDescriptor> {
    const getCompartmentGlobalThis = () => this.globalThis;
    const getTopValue = (property: 'top' | 'parent'): WindowProxy => {
      // if your master app is in an iframe context, allow these props to escape the sandbox
      if (incubatorContext === incubatorContext.parent) {
        return this.globalThis;
      }
      return incubatorContext[property]!;
    };

    const globals: Record<string, PropertyDescriptor> = {
      // avoid code using window.window or window.self to escape the sandbox
      // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
      window: { get: getCompartmentGlobalThis, enumerable: true, configurable: false },
      self: { get: getCompartmentGlobalThis, enumerable: true, configurable: false },
      globalThis: { get: getCompartmentGlobalThis, enumerable: false, configurable: true },

      // proxy.hasOwnProperty would invoke the getter first, then otherwise expose the host implementation
      hasOwnProperty: {
        value: function hasOwnPropertyImpl(this: unknown, key: PropertyKey): boolean {
          // calling from hasOwnProperty.call(obj, key)
          if (this !== getCompartmentGlobalThis() && this !== null && typeof this === 'object') {
            return hasOwnProperty(this, key);
          }

          return hasOwnProperty(rawTarget, key) || hasOwnProperty(incubatorContext, key);
        },
        writable: true,
        enumerable: false,
        configurable: true,
      },

      // Expose the host's eval binding for compatibility. Compartment evaluation itself never calls it.
      // eslint-disable-next-line no-eval
      eval: { value: eval, writable: true, enumerable: false, configurable: true },

      top: {
        get: () => getTopValue('top'),
        configurable: false,
        enumerable: true,
      },
      parent: {
        get: () => getTopValue('parent'),
        configurable: false,
        enumerable: true,
      },

      // Temporarily occupy the document as it may be replaced by the DOM isolation plugin later.
      document: { value: document, writable: true, enumerable: true, configurable: true },
    };

    if (process.env.NODE_ENV === 'test') {
      testOnlyUnshadowableGlobalNames.forEach((key) => {
        globals[key] = { get: getCompartmentGlobalThis, enumerable: false, configurable: true };
      });
    }

    return globals;
  }

  // TODO
  // destroy() {
  //
  // }
}
