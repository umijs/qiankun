/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { QiankunError } from '@qiankunjs/shared';
import { disposeStandardSandbox, patchStandardSandbox, reattachDynamicStylesheets } from './dynamicAppend';
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
  dispose: ({ compartment }) => disposeStandardSandbox(compartment),
  bootstrap: (context) => patchStandardSandbox(context),
  mount: async (context) => {
    const container = context.getContainer();
    if (!container) {
      throw new QiankunError(`${context.appName} requires a container for DOM isolation`, 'container-required');
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
 * Built-in plugins retain the historical patch order. User plugins are appended by the container.
 * DOM isolation appends dynamicAppend to the JavaScript-only base plugins.
 */
export const defaultIsolationPlugins: IsolationPlugin[] = [...baseIsolationPlugins, dynamicAppendPlugin];

export function getDefaultIsolationPlugins(includeDomIsolation: boolean): readonly IsolationPlugin[] {
  return includeDomIsolation ? defaultIsolationPlugins : baseIsolationPlugins;
}

export type { Free, IsolationPlugin, IsolationPluginConfig, IsolationPluginContext, Patch, Rebuild } from './types';
