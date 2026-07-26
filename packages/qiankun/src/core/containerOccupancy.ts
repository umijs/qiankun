/**
 * Container occupancy gate (docs/rfcs/container-occupancy-gate.md).
 *
 * Serializes the DOM writes of micro apps sharing one container element. An app's occupancy is
 * two independent critical sections rather than one long hold — the load-phase streaming render
 * and the mount→unmount period — each acquired and released by loadApp at its own boundaries.
 *
 * The registry is keyed by container element reference: a host re-render that produces a fresh
 * element never contends with holds on the old one. The holding token is the release closure's
 * identity (not the app name), so same-name multi-instance apps stay unambiguous. Waiters are
 * granted FIFO.
 */

import { warn } from '@qiankunjs/shared';

export type ContainerRelease = () => void;

interface ContainerHolding {
  held: boolean;
  /** Current holder's app name, kept only for the dev waiting diagnosis. */
  holderName: string | undefined;
  queue: Array<{ appName: string; grant: (release: ContainerRelease) => void }>;
}

const holdings = new WeakMap<HTMLElement, ContainerHolding>();

/**
 * Waiting longer than this on a held container almost always means the previous app was never
 * unmounted. Correctness comes first, so there is no forced timeout — only a dev diagnosis.
 */
const WAITING_DIAGNOSIS_DELAY = 3_000;

export function acquireContainer(container: HTMLElement, appName: string): Promise<ContainerRelease> {
  let holding = holdings.get(container);
  if (!holding) {
    holding = { held: false, holderName: undefined, queue: [] };
    holdings.set(container, holding);
  }

  if (!holding.held) {
    holding.held = true;
    holding.holderName = appName;
    return Promise.resolve(createRelease(holding));
  }

  return new Promise<ContainerRelease>((resolve) => {
    let waitingDiagnosisTimer: ReturnType<typeof setTimeout> | undefined;
    if (process.env.NODE_ENV === 'development') {
      const holderName = holding.holderName;
      waitingDiagnosisTimer = setTimeout(() => {
        warn(
          `app ${appName} is waiting for container held by ${holderName ?? 'another app'} — did you forget to unmount it?`,
        );
      }, WAITING_DIAGNOSIS_DELAY);
    }

    holding.queue.push({
      appName,
      grant: (release) => {
        if (waitingDiagnosisTimer !== undefined) clearTimeout(waitingDiagnosisTimer);
        resolve(release);
      },
    });
  });
}

function createRelease(holding: ContainerHolding): ContainerRelease {
  let released = false;
  return () => {
    // Idempotent: failure fallbacks and the regular release point may both fire for one hold.
    if (released) return;
    released = true;

    const next = holding.queue.shift();
    if (next) {
      holding.holderName = next.appName;
      next.grant(createRelease(holding));
    } else {
      holding.held = false;
      holding.holderName = undefined;
    }
  };
}
