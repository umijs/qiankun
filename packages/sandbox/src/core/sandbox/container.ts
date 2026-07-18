import { isLoaderStreamedNode, type StyleIsolationOpts } from '@qiankunjs/shared';
import { nativeDocument, qiankunHeadTagName } from '../../consts';

export interface SandboxContainerPreparation {
  styleIsolation: StyleIsolationOpts;
  cleanup: () => void;
}

interface HeadPreparationState {
  head: HTMLElement;
  owners: Set<symbol>;
}

interface NamePreparationState {
  originalHadName: boolean;
  originalName: string | null;
  owners: Array<{ appName: string; token: symbol }>;
}

const headPreparationStates = new WeakMap<HTMLElement, HeadPreparationState>();
const namePreparationStates = new WeakMap<HTMLElement, NamePreparationState>();

export function createStyleIsolationOpts(appName: string): StyleIsolationOpts {
  return { appName, scopeRoot: `[data-name="${appName}"]` };
}

export function containsLoaderStreamedNode(container: HTMLElement): boolean {
  return Array.from(container.querySelectorAll('*')).some(isLoaderStreamedNode);
}

export function ensureSandboxContainerHead(container: HTMLElement): {
  head: HTMLElement;
  cleanup: () => void;
} {
  const existingHead = container.querySelector<HTMLElement>(qiankunHeadTagName);
  const existingState = headPreparationStates.get(container);
  if (existingHead && existingState?.head === existingHead) {
    const token = Symbol('sandbox-container-head-owner');
    existingState.owners.add(token);
    return {
      head: existingHead,
      cleanup: () => {
        const currentState = headPreparationStates.get(container);
        if (currentState !== existingState || !currentState.owners.delete(token) || currentState.owners.size > 0)
          return;
        if (currentState.head.parentNode === container) container.removeChild(currentState.head);
        headPreparationStates.delete(container);
      },
    };
  }
  if (existingHead) {
    return { head: existingHead, cleanup: () => {} };
  }

  const head = nativeDocument.createElement(qiankunHeadTagName);
  const token = Symbol('sandbox-container-head-owner');
  const state: HeadPreparationState = { head, owners: new Set([token]) };
  headPreparationStates.set(container, state);
  container.insertBefore(head, container.firstChild);

  let cleaned = false;
  return {
    head,
    cleanup: () => {
      if (cleaned) return;
      cleaned = true;
      const currentState = headPreparationStates.get(container);
      if (currentState !== state || !currentState.owners.delete(token) || currentState.owners.size > 0) return;
      if (head.parentNode === container) container.removeChild(head);
      headPreparationStates.delete(container);
    },
  };
}

export function prepareSandboxContainerName(container: HTMLElement, appName: string): () => void {
  let state = namePreparationStates.get(container);
  if (!state) {
    state = {
      originalHadName: container.hasAttribute('data-name'),
      originalName: container.getAttribute('data-name'),
      owners: [],
    };
    namePreparationStates.set(container, state);
  }
  const token = Symbol('sandbox-container-name-owner');
  state.owners.push({ appName, token });
  container.dataset.name = appName;

  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    const currentState = namePreparationStates.get(container);
    if (currentState !== state) return;
    const ownerIndex = currentState.owners.findIndex((owner) => owner.token === token);
    if (ownerIndex < 0) return;
    const wasCurrentOwner = ownerIndex === currentState.owners.length - 1;
    currentState.owners.splice(ownerIndex, 1);
    if (!wasCurrentOwner || container.dataset.name !== appName) {
      if (!currentState.owners.length) namePreparationStates.delete(container);
      return;
    }

    const previousOwner = currentState.owners.at(-1);
    if (previousOwner) {
      container.dataset.name = previousOwner.appName;
      return;
    }
    if (currentState.originalHadName && currentState.originalName !== null) {
      container.setAttribute('data-name', currentState.originalName);
    } else {
      container.removeAttribute('data-name');
    }
    namePreparationStates.delete(container);
  };
}

/**
 * Establish the DOM contract used by the standard sandbox preset.
 *
 * Cleanup only reverts state created by this call: an existing head is kept and
 * a host update made after preparation is never overwritten.
 */
export function prepareSandboxContainer(container: HTMLElement, appName: string): SandboxContainerPreparation {
  const cleanupName = prepareSandboxContainerName(container, appName);
  const { cleanup: cleanupHead } = ensureSandboxContainerHead(container);
  let cleaned = false;

  return {
    styleIsolation: createStyleIsolationOpts(appName),
    cleanup: () => {
      if (cleaned) return;
      cleaned = true;
      cleanupHead();
      cleanupName();
    },
  };
}
