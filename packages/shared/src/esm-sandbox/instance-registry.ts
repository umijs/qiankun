/**
 * Internal bridge through which an instance-private runtime module reaches
 * its Compartment view and host-provided module namespaces.
 */
import { defineProperty, hasOwnProperty } from '../utils';
import { esmInternalPrefix } from './rewrite';
import type { ModuleNamespace } from './types';

export type EsmInstance = {
  /** globals view object for the top-of-module destructuring injection */
  view: Record<string, unknown>;
  /** import.meta.resolve implementation, returning the original URL */
  resolve: (specifier: string, baseUrl?: string) => string;
  /** Dynamic import pipeline entry bound by a runtime bridge to one document credentials context. */
  dynamicImport: (credentialsKey: string, specifier: unknown, ...args: unknown[]) => Promise<ModuleNamespace>;
  /** register a module's live dunder-global bindings refresher */
  track: (refresh: () => void) => void;
  /** retrieve a namespace descriptor for a generated bridge module */
  getNamespace: (token: string) => ModuleNamespace | undefined;
};

export type InstanceHandle = {
  /** random per-qiankun-copy global accessor key */
  accessorKey: string;
  /** unguessable per-instance registry token */
  token: string;
};

export const createRandomHex = (bytes = 16): string => {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.prototype.map.call(buffer, (b: number) => b.toString(16).padStart(2, '0')).join('');
};

const accessorKey = `${esmInternalPrefix}i_${createRandomHex(8)}`;
const instancesByToken = new Map<string, EsmInstance>();

let accessorInstalled = false;
const ensureInstanceAccessor = (): void => {
  if (!accessorInstalled) {
    if (!hasOwnProperty(globalThis, accessorKey)) {
      defineProperty(globalThis, accessorKey, {
        value: (token: string): EsmInstance | undefined => instancesByToken.get(token),
        writable: false,
        enumerable: false,
        configurable: false,
      });
    }
    accessorInstalled = true;
  }
};

export const registerEsmInstance = (instance: EsmInstance): InstanceHandle => {
  ensureInstanceAccessor();
  const token = createRandomHex();
  instancesByToken.set(token, instance);
  return { accessorKey, token };
};

export const unregisterEsmInstance = (token: string): void => {
  instancesByToken.delete(token);
};
