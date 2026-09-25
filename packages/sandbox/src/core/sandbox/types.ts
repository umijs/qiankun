/**
 * @author Kuitos
 * @since 2023-05-04
 */

import type { Compartment } from '../compartment';

export interface Sandbox extends Compartment {
  active(): void;

  inactive(): void;
}
