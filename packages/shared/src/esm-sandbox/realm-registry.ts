/**
 * @author Kuitos
 * @since 2026-07-04
 * The internal bridge that lets a per-instance runtime module reach its realm (RFC §1).
 *
 * The accessor MUST NOT be reachable by sub-app code. Two properties enforce that:
 * - the accessor is installed under a cryptographically random, per-copy key (still `__qk_`-prefixed
 *   so the membrane blacklist keeps proxy member access shielded as defence in depth), and
 * - it is indexed by an unguessable per-instance token rather than the guessable instanceKey.
 *
 * A rewritten ESM blob module runs in the real global scope, so a bare `__qk_realm(...)` reference
 * would bypass the membrane entirely (free identifiers resolve against the real global, never the
 * proxy). The token defeats that: the token lives only inside the instance's own runtime-module blob
 * source (whose specifier the rewriter refuses to let user code import), so app code can neither name
 * the random accessor key nor supply another instance's token.
 *
 * Each qiankun copy owns its own random key and realms map, so two copies on one page never collide
 * (fixing the single-`__qk_realm`-owner crash) — no shared global singleton to contend for.
 */
import { defineProperty, hasOwnProperty } from '../utils';
import { esmInternalPrefix } from './rewrite';

export type EsmRealm = {
  /** globals view object for the top-of-module destructuring injection */
  view: Record<string, unknown>;
  /** import.meta.resolve implementation, returns the original URL rather than the internal blob URL */
  resolve: (specifier: string, baseUrl?: string) => string;
  /** dynamic import pipeline entry */
  dynamicImport: (specifier: unknown, ...args: unknown[]) => Promise<Record<string, unknown>>;
};

export type RealmHandle = {
  /** the global accessor key the runtime module reads (random per qiankun copy) */
  accessorKey: string;
  /** the unguessable token the runtime module passes to the accessor */
  token: string;
};

const randomHex = (bytes = 16): string => {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.prototype.map.call(buffer, (b: number) => b.toString(16).padStart(2, '0')).join('');
};

// per-copy state: a random accessor key and a private token -> realm map, installed once
const accessorKey = `${esmInternalPrefix}r_${randomHex(8)}`;
const realmsByToken = new Map<string, EsmRealm>();

let accessorInstalled = false;
const ensureRealmAccessor = (): void => {
  if (!accessorInstalled) {
    // defensive: never clobber a colliding key (astronomically unlikely) owned by another copy
    if (!hasOwnProperty(globalThis, accessorKey)) {
      defineProperty(globalThis, accessorKey, {
        value: (token: string): EsmRealm | undefined => realmsByToken.get(token),
        writable: false,
        enumerable: false,
        configurable: false,
      });
    }
    accessorInstalled = true;
  }
};

export const registerEsmRealm = (realm: EsmRealm): RealmHandle => {
  ensureRealmAccessor();
  const token = randomHex();
  realmsByToken.set(token, realm);
  return { accessorKey, token };
};

export const unregisterEsmRealm = (token: string): void => {
  realmsByToken.delete(token);
};
