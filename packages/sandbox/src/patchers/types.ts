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

/**
 * Setup hooks run in installation order: built-in plugins first, then user plugins in
 * registration order. Every teardown — the Free callbacks and `dispose` — runs in reverse
 * installation order, because a plugin may depend on views owned by plugins installed before it
 * (a user plugin on the built-in document view), so those must outlive it.
 */
export interface IsolationPlugin {
  name: string;
  /** Runs once, before any application script is evaluated. */
  bootstrap?: (context: IsolationPluginContext) => Free;
  /**
   * Runs for every mount. Async setup must settle before application mount continues. On
   * unmount, mount-phase Frees run before bootstrap-phase ones; their rebuilds replay in
   * installation order on the next mount.
   */
  mount?: (context: IsolationPluginContext) => Free | Promise<Free>;
  /**
   * Runs once on terminal disposal, after active Free callbacks and before the Compartment
   * is disposed, in reverse installation order like the Frees. Release caches and retained
   * views here; ordinary unmount keeps them for remount. Must also tolerate partially
   * completed bootstrap setup.
   */
  dispose?: (context: IsolationPluginContext) => void;
}
