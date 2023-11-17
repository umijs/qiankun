/**
 * @author Kuitos
 * @since 2023-05-04
 */
import type { BaseLoaderOpts, NodeTransformer } from '@qiankunjs/shared';
import type { Deferred } from '@qiankunjs/shared';
import type { Sandbox } from '../../core/sandbox';

export type SandboxConfig = {
  appName: string;
  sandbox: Sandbox;
  dynamicStyleSheetElements: Array<HTMLStyleElement | HTMLLinkElement>;
  dynamicExternalSyncScriptDeferredList: Array<Deferred<void>>;
  nodeTransformer: NodeTransformer;
} & BaseLoaderOpts;
