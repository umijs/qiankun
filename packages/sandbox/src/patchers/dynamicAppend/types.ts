/**
 * @author Kuitos
 * @since 2023-05-04
 */
import type { BaseLoaderOpts, Deferred, NodeTransformer, StyleIsolationOpts } from '@qiankunjs/shared';
import type { IsolationPluginContext } from '../types';

export type SandboxConfig = {
  appName: string;
  compartment: IsolationPluginContext['compartment'];
  dynamicStyleSheetElements: Array<HTMLStyleElement | HTMLLinkElement>;
  dynamicExternalSyncScriptDeferredList: Array<Deferred<void>>;
  nodeTransformer: NodeTransformer;
  styleIsolation?: StyleIsolationOpts;
} & BaseLoaderOpts;
