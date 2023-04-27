// type Transform = (source: string) => string;
// type ModuleMap = Record<string, string>;
//
// interface CompartmentOptions {
//   transforms?: Transform[];
// }

import { nativeGlobal } from '../consts';

const compartmentGlobalIdPrefix = '__compartment_globalThis__';
const compartmentGlobalIdSuffix = '__';
type CompartmentGlobalId = `${typeof compartmentGlobalIdPrefix}${string}${typeof compartmentGlobalIdSuffix}`;

declare global {
  interface Window {
    __compartment_window__?: Window;

    [p: CompartmentGlobalId]: WindowProxy;
  }
}

let compartmentCounter = 0;

export class Compartment {
  /**
   * Since the time of execution of the code in Compartment is determined by the browser, a unique compartmentSpecifier should be generated in Compartment
   */
  private readonly id: CompartmentGlobalId = (() => {
    {
      // make sure the compartmentSpecifier is unique
      while (nativeGlobal[`${compartmentGlobalIdPrefix}${String(compartmentCounter)}`]) {
        compartmentCounter++;
      }
      return `${compartmentGlobalIdPrefix}${String(compartmentCounter)}__`;
    }
  })();

  protected globalContext: WindowProxy = window;

  constructor(globals?: Record<string, any>) {
    if (globals) {
      Object.keys(globals).forEach((k) => {
        this.globalContext[k as any] = globals[k];
      });
    }
  }

  get globalThis(): WindowProxy {
    return this.globalContext;
  }

  makeEvaluator(source: string, sourceURL?: string): string {
    const sourceMapURL = sourceURL ? `//# sourceURL=${sourceURL}\n` : '';

    const globalObjectConstants = ['window', 'globalThis'];
    const globalObjectOptimizer = `const {${globalObjectConstants.join(',')}} = this;`;

    nativeGlobal[this.id] = this.globalContext;
    // eslint-disable-next-line max-len
    return `;(function(){with(this){${globalObjectOptimizer}${source}\n${sourceMapURL}}}).bind(window.${this.id})();`;
  }

  // evaluate<T>(code: string, options?: CompartmentOptions): T {
  //   const script = document.createElement('script');
  // }
}
