import { Compartment } from './Compartment';
import { createMembrane } from './membrane';

export class Sandbox extends Compartment {
  constructor(globals: Record<string, any> = {}) {
    super(globals);

    const { globalThis = window } = globals;

    const { membrane } = createMembrane(globalThis);
    this.globalProxy = new Proxy(membrane, {});
  }
}
