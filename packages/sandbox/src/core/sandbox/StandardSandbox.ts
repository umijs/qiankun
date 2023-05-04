/* eslint-disable @typescript-eslint/method-signature-style */
import { Compartment } from '../compartment';
import { createMembrane } from '../membrane';
import { SandboxType } from './types';
import type { Sandbox } from './types';

export class StandardSandbox extends Compartment implements Sandbox {
  private membrane: ReturnType<typeof createMembrane>;

  readonly type = SandboxType.Standard;

  async active() {
    this.membrane.unlock();
  }

  async inactive() {
    this.membrane.lock();
  }

  constructor(globals: Record<string, any> = {}, globalContext: WindowProxy = window) {
    super(globals);

    const membrane = createMembrane(globalContext, {}, [], globals);
    this.membrane = membrane;

    // Override the globalContext
    this.globalContext = membrane.instance;
  }

  get latestSetProp() {
    return this.membrane.latestSetProp;
  }

  // TODO
  // destroy() {
  //
  // }
}
