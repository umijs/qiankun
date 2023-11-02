/**
 * @author Kuitos
 * @since 2023-05-04
 */
import type { Sandbox } from '../../core/sandbox';

export type SandboxConfig = {
  appName: string;
  sandbox: Sandbox;
  dynamicStyleSheetElements: Array<HTMLStyleElement | HTMLLinkElement>;
  dynamicExternalSyncScriptElements: HTMLScriptElement[];
};
