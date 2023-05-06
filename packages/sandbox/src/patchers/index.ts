/**
 * @author Kuitos
 * @since 2019-04-11
 */

import type { Sandbox } from '../core/sandbox/types';
import { SandboxType } from '../core/sandbox/types';
import { patchStandardSandbox } from './dynamicAppend';
import patchHistoryListener from './historyListener';
import patchInterval from './interval';
import type { Free } from './types';
import patchWindowListener from './windowListener';

export function patchAtBootstrapping(appName: string, getContainer: () => HTMLElement, sandbox: Sandbox): Free[] {
  const patchersInSandbox = {
    [SandboxType.Standard]: [() => patchStandardSandbox(appName, getContainer, { sandbox, mounting: false })],
    [SandboxType.Snapshot]: [],
  } as const;

  return patchersInSandbox[sandbox.type]?.map((patch) => patch());
}

export function patchAtMounting(appName: string, getContainer: () => HTMLElement, sandbox: Sandbox): Free[] {
  const basePatchers = [
    () => patchInterval(sandbox.globalThis),
    () => patchWindowListener(sandbox.globalThis),
    () => patchHistoryListener(),
  ];

  const patchersInSandbox = {
    [SandboxType.Standard]: [
      ...basePatchers,
      () => patchStandardSandbox(appName, getContainer, { sandbox, mounting: true }),
    ],
    [SandboxType.Snapshot]: basePatchers,
  };

  return patchersInSandbox[sandbox.type]?.map((patch) => patch());
}
