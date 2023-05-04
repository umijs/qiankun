/**
 * @author Kuitos
 * @since 2023-05-04
 */

import type { Compartment } from '../compartment';

export enum SandboxType {
  Standard = 'Standard',
  Snapshot = 'Snapshot',
}

export interface Sandbox extends Compartment {
  type: SandboxType;

  active: () => void;

  inactive: () => void;

  // TODO for gc
  // destroy(): void;
}
