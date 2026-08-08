/**
 * @author Kuitos
 * @since 2023-05-04
 */
import type { BaseLoaderOpts, NodeTransformer, StyleIsolationOpts } from '@qiankunjs/shared';
import type { Compartment } from '../core/compartment';

export type Rebuild = (container?: HTMLElement) => Promise<void>;
export type Free = () => Rebuild;
export type Patch = () => Free;

export type IsolationPluginConfig = BaseLoaderOpts & {
  nodeTransformer: NodeTransformer;
  styleIsolation?: StyleIsolationOpts;
};

export interface IsolationPluginContext {
  /** The public compartment facade. Plugins must not depend on its membrane implementation. */
  compartment: Compartment;
  appName: string;
  /** Always resolve the current container lazily so remounts can replace it. */
  getContainer: () => HTMLElement | undefined;
  config: IsolationPluginConfig;
}

export interface IsolationPlugin {
  name: string;
  /** Runs once, before any application script is evaluated. */
  bootstrap?: (context: IsolationPluginContext) => Free;
  /** Runs for every mount. Async setup must settle before application mount continues. */
  mount?: (context: IsolationPluginContext) => Free | Promise<Free>;
}
