// type Transform = (source: string) => string;
// type ModuleMap = Record<string, string>;
//
// interface CompartmentOptions {
//   transforms?: Transform[];
// }

import { nativeWindow } from '../consts';

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
  private readonly compartmentSpecifier: CompartmentSpecifier;
  protected globalProxy: WindowProxy = window;

  constructor(globals?: Record<string, any>) {
    if (globals) {
      Object.keys(globals).forEach((k) => {
        this.globalProxy[k as any] = globals[k];
      });
    }

    this.compartmentSpecifier = (() => {
      while (nativeWindow[`${compartmentSpecifierPrefix}${String(compartmentCounter)}`]) {
        compartmentCounter++;
      }
      return `${compartmentSpecifierPrefix}${String(compartmentCounter)}`;
    })();
  }

  get globalThis(): WindowProxy {
    return this.globalProxy;
  }

  makeEvaluator(source: string, sourceURL?: string): string {
    nativeWindow[this.compartmentSpecifier] = this.globalProxy;

    const sourceMapURL = sourceURL ? `//# sourceURL=${sourceURL}\n` : '';
    const globalObjectOptimizer = ['window', 'globalThis'].join(',');

    // eslint-disable-next-line max-len
    return `;with(window.${this.compartmentSpecifier}){(function(${globalObjectOptimizer}){;${source}\n${sourceMapURL}}).bind(window)(${globalObjectOptimizer})};`;
  }

  // evaluate<T>(code: string, options?: CompartmentOptions): T {
  //   const script = document.createElement('script');
  // }
}
