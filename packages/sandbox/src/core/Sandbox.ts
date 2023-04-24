/* eslint-disable @typescript-eslint/method-signature-style */
import { Compartment } from './Compartment';
import { createMembrane } from './membrane';

interface SandboxInterface {
  active(): void;
  inactive(): void;
  // TODO
  // destroy(): void;
}

export class Sandbox extends Compartment implements SandboxInterface {
  private membrane: ReturnType<typeof createMembrane>;

  constructor(globals: Record<string, any> = {}) {
    super(globals);

    const { globalThis = window } = globals;

    const membrane = createMembrane(globalThis, {}, []);
    this.membrane = membrane;
    this.globalContext = membrane.instance;
  }

  active() {
    this.membrane.unlock();
  }

  inactive() {
    this.membrane.lock();
  }

  // TODO
  // destroy() {
  //
  // }
}
