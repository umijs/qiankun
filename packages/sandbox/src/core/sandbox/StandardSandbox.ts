import { without } from 'lodash';
import { hasOwnProperty } from '../../utils';
import { Compartment } from '../compartment';
import { Membrane } from '../membrane';
import { Sandbox, SandboxType } from './types';
import { globals as constantGlobals } from './globals';

const whitelistBOMAPIs = ['requestAnimationFrame', 'cancelAnimationFrame'];

export class StandardSandbox extends Compartment implements Sandbox {
  private readonly membrane: Membrane;

  readonly type = SandboxType.Standard;

  readonly name: string;

  constructor(name: string, globals: Record<string, any>, incubatorContext: WindowProxy = window) {
    const getRealmGlobal = () => realmGlobal;
    const getTopValue = (p: 'top' | 'parent') => {
      // if your master app in an iframe context, allow these props escape the sandbox
      if (incubatorContext === incubatorContext.parent) {
        return realmGlobal;
      }
      return (incubatorContext as any)[p];
    };

    const intrinsics: Record<string, PropertyDescriptor> = {
      // avoid who using window.window or window.self to escape the sandbox environment to touch the real window
      // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
      window: { get: getRealmGlobal, enumerable: true, configurable: false },
      self: { get: getRealmGlobal, enumerable: true, configurable: false },
      globalThis: { get: getRealmGlobal, enumerable: false, configurable: true },

      // proxy.hasOwnProperty would invoke getter firstly, then its value represented as incubatorContext.hasOwnProperty
      hasOwnProperty: {
        value: function hasOwnPropertyImpl(this: any, key: PropertyKey): boolean {
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

    const constantNames = Array.from(new Set(Object.keys(intrinsics).concat(constantGlobals).concat(whitelistBOMAPIs)));
    // intrinsics should not be escaped from sandbox
    const unscopables = without(constantNames, ...Object.keys(intrinsics)).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      // Notes that babel will transpile spread operator to Object.assign({}, ...args), which will keep the prototype of Object in merged object,
      // while this result used as Symbol.unscopables, it will make properties in Object.prototype always be escaped from proxy sandbox as unscopables check will look up prototype chain as well,
      // such as hasOwnProperty, toString, valueOf, etc.
      // so we should use Object.create(null) to create a pure object without prototype chain here.
      Object.create(null),
    );
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

  addIntrinsics(intrinsics: Record<string, PropertyDescriptor>) {
    this.membrane.addIntrinsics(intrinsics);
  }

  async active() {
    this.membrane.unlock();
  }

  async inactive() {
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
