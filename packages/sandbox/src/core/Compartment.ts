// type Transform = (source: string) => string;
// type ModuleMap = Record<string, string>;
//
// interface CompartmentOptions {
//   transforms?: Transform[];
// }

import { nativeGlobal } from '../consts';

const compartmentSpecifierPrefix = '__compartment_globalThis__';
type CompartmentSpecifier = `${typeof compartmentSpecifierPrefix}${string}`;

declare global {
  interface Window {
    __compartment_window__?: Window;
    [p: CompartmentSpecifier]: WindowProxy;
  }
}

let compartmentCounter = 0;

export class Compartment {
  /**
   * Since the time of execution of the code in Compartment is determined by the browser, a unique compartmentSpecifier should be generated in Compartment
   * @private
   */
  private readonly compartmentSpecifier: CompartmentSpecifier = (() => {
    // make sure the compartmentSpecifier is unique
    while (nativeGlobal[`${compartmentSpecifierPrefix}${String(compartmentCounter)}`]) {
      compartmentCounter++;
    }
    return `${compartmentSpecifierPrefix}${String(compartmentCounter)}`;
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
    nativeGlobal[this.compartmentSpecifier] = this.globalContext;

    const sourceMapURL = sourceURL ? `//# sourceURL=${sourceURL}\n` : '';

    const globalObjectConstants = ['window', 'globalThis'];
    const globalObjectOptimizer = `const {${globalObjectConstants.join(',')}} = this;`;

    // eslint-disable-next-line max-len
    return `;(function(){with(this){${globalObjectOptimizer}${source}\n${sourceMapURL}}}).bind(window.${this.compartmentSpecifier})();`;
  }

  // evaluate<T>(code: string, options?: CompartmentOptions): T {
  //   const script = document.createElement('script');
  // }
}
