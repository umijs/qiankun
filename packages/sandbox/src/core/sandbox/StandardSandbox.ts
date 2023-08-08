import { Compartment } from '../compartment';
import { createMembrane } from '../membrane';
import { Sandbox, SandboxType } from './types';
import { globals as constantGlobals } from './globals';

const whitelistBOMAPIs = ['requestAnimationFrame', 'cancelAnimationFrame'];

export class StandardSandbox extends Compartment implements Sandbox {
  private readonly membrane: ReturnType<typeof createMembrane>;

  readonly type = SandboxType.Standard;

  readonly name: string;

  constructor(name: string, globals: Record<string, any>, globalContext: WindowProxy = window) {
    const membrane = createMembrane(globalContext, {}, { whitelistVariables: [], extraContext: globals });
    const { instance: membraneInstance } = membrane;

    super(membraneInstance);

    this.name = name;
    this.membrane = membrane;

    const getTopValue = (p: 'top' | 'parent') => {
      // if your master app in an iframe context, allow these props escape the sandbox
      if (globalContext === globalContext.parent) {
        return membraneInstance;
      }
      return (globalContext as any)[p];
    };

    this.membrane.addIntrinsics((rawTarget) => {
      const intrinsics: Record<string, PropertyDescriptor> = {
        // avoid who using window.window or window.self to escape the sandbox environment to touch the real window
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        window: { value: membraneInstance, writable: false, enumerable: true, configurable: false },
        self: { value: membraneInstance, writable: false, enumerable: true, configurable: false },
        globalThis: { value: membraneInstance, writable: true, enumerable: false, configurable: true },

        // proxy.hasOwnProperty would invoke getter firstly, then its value represented as globalContext.hasOwnProperty
        hasOwnProperty: {
          value: function hasOwnProperty(this: any, key: PropertyKey): boolean {
            // calling from hasOwnProperty.call(obj, key)
            if (this !== membraneInstance && this !== null && typeof this === 'object') {
              return Object.prototype.hasOwnProperty.call(this, key);
            }

            return rawTarget.hasOwnProperty(key) || globalContext.hasOwnProperty(key);
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
      };

      if (process.env.NODE_ENV === 'test') {
        intrinsics.mockGlobalThis = { value: membraneInstance, writable: true, enumerable: false, configurable: true };
      }

      const constants = Array.from(new Set(Object.keys(intrinsics).concat(whitelistBOMAPIs).concat(constantGlobals)));
      this.addConstantIntrinsicNames(constants);

      return intrinsics;
    });
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
