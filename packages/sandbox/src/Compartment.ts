// type Transform = (source: string) => string;
// type ModuleMap = Record<string, string>;
//
// interface CompartmentOptions {
//   transforms?: Transform[];
// }
//
// const nativeWindow = new Function('return window')();
//
// export class Compartment {
//   private readonly globalObject: Record<string, any>;
//
//   constructor(globals?: object) {
//     this.globalObject = globals || {};
//   }
//
//   get globalThis(): Record<string, any> {
//     return this.globalObject;
//   }
//
//   private makeEvaluate<T>(options?: CompartmentOptions): (code: string) => T {}
//
//   evaluate<T>(code: string, options?: CompartmentOptions): T {
//     const script = document.createElement('script');
//   }
// }
