/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { SandboxType } from '../core/sandbox/types';
import { QiankunError } from '@qiankunjs/shared';
import { patchStandardSandbox, reattachDynamicStylesheets } from './dynamicAppend';
import patchHistoryListener from './historyListener';
import patchInterval from './interval';
import type { IsolationPlugin } from './types';
import patchWindowListener from './windowListener';

const intervalPlugin: IsolationPlugin = {
  name: 'interval',
  mount: ({ compartment }) => patchInterval(compartment.globalThis),
};

const windowListenerPlugin: IsolationPlugin = {
  name: 'windowListener',
  mount: ({ compartment }) => patchWindowListener(compartment.globalThis),
};

const historyListenerPlugin: IsolationPlugin = {
  name: 'historyListener',
  mount: () => patchHistoryListener(),
};

const dynamicAppendPlugin: IsolationPlugin = {
  name: 'dynamicAppend',
  bootstrap: (context) => patchStandardSandbox(context),
  mount: async (context) => {
    const container = context.getContainer();
    if (!container) {
      throw new QiankunError(`${context.appName} requires a container for DOM isolation`);
    }
    const free = patchStandardSandbox(context);
    try {
      await reattachDynamicStylesheets(context.compartment, container);
    } catch (error) {
      // The patch above is already live but its Free has not been handed to the
      // container yet — undo it here, otherwise a reattach failure would strand
      // the shared DOM-prototype/CSSOM patches for the rest of the page lifetime.
      free();
      throw error;
    }
    return free;
  },
};

const baseIsolationPlugins = [intervalPlugin, windowListenerPlugin, historyListenerPlugin] as const;

/**
 * Built-in presets retain the historical patch order. User plugins are appended by the container.
 * Snapshot remains a fallback preset and deliberately omits the standard DOM interception plugin.
 */
export const defaultIsolationPlugins = {
  [SandboxType.Standard]: [...baseIsolationPlugins, dynamicAppendPlugin],
  [SandboxType.Snapshot]: baseIsolationPlugins,
} satisfies Record<SandboxType, readonly IsolationPlugin[]>;

export function getDefaultIsolationPlugins(
  sandboxType: SandboxType,
  includeDomIsolation = true,
): readonly IsolationPlugin[] {
  return includeDomIsolation ? defaultIsolationPlugins[sandboxType] : baseIsolationPlugins;
}

export type { Free, IsolationPlugin, IsolationPluginConfig, IsolationPluginContext, Patch, Rebuild } from './types';
