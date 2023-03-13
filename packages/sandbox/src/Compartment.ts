type Transform = (source: string) => string;
type ModuleMap = Record<string, string>;

interface CompartmentOptions {
  transforms?: Transform[];
}

export class Compartment {
  constructor(globals?: object, moduleMap?: ModuleMap, options?: CompartmentOptions) {}

  get globalThis(): Record<string, any>;

  evaluate(code: string, options?: CompartmentOptions): any;
}
