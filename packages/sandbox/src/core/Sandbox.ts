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

  constructor(globals: Record<string, any> = {}, globalContext: WindowProxy = window) {
    super(globals);

    const membrane = createMembrane(globalContext, {}, [], globals);
    this.membrane = membrane;
    this.globalContext = membrane.instance;
  }

  get latestSetProp() {
    return this.membrane.latestSetProp;
  }

  async active() {
    this.membrane.unlock();
  }

  async inactive() {
    this.membrane.lock();
  }

  // TODO
  // destroy() {
  //
  // }
}
