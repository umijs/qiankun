import { hasOwnProperty } from '@qiankunjs/shared';
import { without } from 'lodash';
import { Compartment } from '../compartment';
import { globalsInES2015 } from '../globals';
import type { Endowments } from '../membrane';
import { Membrane } from '../membrane';
import { array2TruthyObject } from '../utils';
import type { Sandbox } from './types';
import { SandboxType } from './types';

const whitelistBOMAPIs = ['requestAnimationFrame', 'cancelAnimationFrame'];

export class StandardSandbox extends Compartment implements Sandbox {
  private readonly membrane: Membrane;

  readonly type = SandboxType.Standard;

  readonly name: string;

  constructor(name: string, globals: Endowments, incubatorContext: WindowProxy = window) {
    const getRealmGlobal = () => realmGlobal;
    const getTopValue = (p: 'top' | 'parent'): WindowProxy => {
      // if your master app in an iframe context, allow these props escape the sandbox
      if (incubatorContext === incubatorContext.parent) {
        return realmGlobal;
      }
      return incubatorContext[p]!;
    };

    const intrinsics: Record<string, PropertyDescriptor> = {
      // avoid who using window.window or window.self to escape the sandbox environment to touch the real window
      // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
      window: { get: getRealmGlobal, enumerable: true, configurable: false },
      self: { get: getRealmGlobal, enumerable: true, configurable: false },
      globalThis: { get: getRealmGlobal, enumerable: false, configurable: true },

      // proxy.hasOwnProperty would invoke getter firstly, then its value represented as incubatorContext.hasOwnProperty
      hasOwnProperty: {
        value: function hasOwnPropertyImpl(this: unknown, key: PropertyKey): boolean {
          // calling from hasOwnProperty.call(obj, key)
          if (this !== realmGlobal && this !== null && typeof this === 'object') {
            return hasOwnProperty(this, key);
          }

          return hasOwnProperty(target, key) || hasOwnProperty(incubatorContext, key);
        },
        writable: true,
        enumerable: false,
        configurable: true,
      },

      // eslint-disable-next-line no-eval
      eval: { value: eval, writable: true, enumerable: false, configurable: true },

      top: {
        get() {
          return getTopValue('top');
        },
        configurable: false,
        enumerable: true,
      },
      parent: {
        get() {
          return getTopValue('parent');
        },
        configurable: false,
        enumerable: true,
      },

      // Temporarily occupy the document as it may be modified later
      document: { value: document, writable: true, enumerable: true, configurable: true },
    };
    if (process.env.NODE_ENV === 'test') {
      ['mockSafariTop', 'mockTop', 'mockGlobalThis'].forEach((key) => {
        intrinsics[key] = { get: getRealmGlobal, enumerable: false, configurable: true };
      });
    }

    const constantNames = Array.from(new Set(Object.keys(intrinsics).concat(globalsInES2015).concat(whitelistBOMAPIs)));
    // intrinsics should not be escaped from sandbox
    const unscopables = array2TruthyObject(without(constantNames, ...Object.keys(intrinsics)));
    const membrane = new Membrane(incubatorContext, unscopables, {
      whitelist: [],
      endowments: { ...intrinsics, ...globals },
    });

    const { realmGlobal, target } = membrane;

    super(realmGlobal);

    this.name = name;
    this.membrane = membrane;

    this.addConstantIntrinsicNames(constantNames);
  }

  get latestSetProp() {
    return this.membrane.latestSetProp;
  }

  /**
   * Globals view for the ESM top-of-module destructuring injection (ESM sandbox RFC §1).
   * The membrane realm global already provides exactly the required semantics for every key —
   * base-set names, runtime-created dunder flags, and unknown keys all resolve through the same
   * get trap (shielding, endowments, incubator read-through included) — so the view IS the realm
   * global; a separate getter/Proxy layer would only duplicate that read path.
   */
  getEsmGlobalsView(): Record<string, unknown> {
    return this.membrane.realmGlobal as unknown as Record<string, unknown>;
  }

  /**
   * Subscribe to global modifications inside this sandbox; the ESM engine uses it to keep the
   * live dunder-global bindings of already-evaluated modules in sync (ESM sandbox RFC §1).
   * Only membrane-mediated writes are observed: a host app writing directly on the real window
   * after modules evaluated will not trigger a refresh (known one-way visibility boundary).
   */
  onGlobalSet(listener: (p: PropertyKey) => void): () => void {
    return this.membrane.onModification(listener);
  }

  addIntrinsics(intrinsics: Record<string, PropertyDescriptor>) {
    this.membrane.addIntrinsics(intrinsics);
  }

  active() {
    this.membrane.unlock();
  }

  inactive() {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
        ...this.membrane.modifications.keys(),
      ]);
    }

    this.membrane.lock();
  }

  // TODO
  // destroy() {
  //
  // }
}
