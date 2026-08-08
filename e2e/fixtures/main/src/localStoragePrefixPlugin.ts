import type { IsolationPlugin } from 'qiankun';

const toStorageKey = (prefix: string, key: string): string => `${prefix}${key}`;

const getPrefixedKeys = (storage: Storage, prefix: string): string[] => {
  const result: string[] = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (key?.startsWith(prefix)) result.push(key.slice(prefix.length));
  }
  return result;
};

/**
 * A virtual Storage object whose complete named-property surface is scoped to
 * one prefix. The proxy target is empty on purpose: forwarding unknown traps
 * to the native Storage object would expose other compartments' keys.
 */
const createPrefixedStorage = (nativeStorage: Storage, prefix: string): Storage => {
  const methods = new Map<string, unknown>([
    [
      'clear',
      () => {
        getPrefixedKeys(nativeStorage, prefix).forEach((key) => nativeStorage.removeItem(toStorageKey(prefix, key)));
      },
    ],
    ['getItem', (key: string) => nativeStorage.getItem(toStorageKey(prefix, String(key)))],
    ['key', (index: number) => getPrefixedKeys(nativeStorage, prefix)[index] ?? null],
    ['removeItem', (key: string) => nativeStorage.removeItem(toStorageKey(prefix, String(key)))],
    [
      'setItem',
      (key: string, value: string) => nativeStorage.setItem(toStorageKey(prefix, String(key)), String(value)),
    ],
  ]);

  const target = Object.create(null) as Record<PropertyKey, unknown>;
  return new Proxy(target, {
    deleteProperty(_target, property) {
      if (typeof property !== 'string') return true;
      nativeStorage.removeItem(toStorageKey(prefix, property));
      return true;
    },
    get(_target, property) {
      if (property === Symbol.toStringTag) return 'Storage';
      if (property === 'length') return getPrefixedKeys(nativeStorage, prefix).length;
      if (typeof property !== 'string') return undefined;
      if (methods.has(property)) return methods.get(property);
      return nativeStorage.getItem(toStorageKey(prefix, property)) ?? undefined;
    },
    getOwnPropertyDescriptor(_target, property) {
      if (typeof property !== 'string') return undefined;
      const value = nativeStorage.getItem(toStorageKey(prefix, property));
      return value === null
        ? undefined
        : {
            configurable: true,
            enumerable: true,
            value,
            writable: true,
          };
    },
    has(_target, property) {
      if (property === Symbol.toStringTag || property === 'length') return true;
      if (typeof property !== 'string') return false;
      return methods.has(property) || nativeStorage.getItem(toStorageKey(prefix, property)) !== null;
    },
    ownKeys() {
      return getPrefixedKeys(nativeStorage, prefix);
    },
    set(_target, property, value) {
      if (typeof property !== 'string') return false;
      nativeStorage.setItem(toStorageKey(prefix, property), String(value));
      return true;
    },
  }) as unknown as Storage;
};

/**
 * Example of a repository-external isolation plugin: it imports only qiankun's
 * public type and installs its global exclusively through the Compartment API.
 */
export function createLocalStoragePrefixPlugin(prefix: string): IsolationPlugin {
  return {
    name: `local-storage-prefix:${prefix}`,
    bootstrap({ compartment }) {
      const prefixedStorage = createPrefixedStorage(window.localStorage, prefix);

      compartment.defineUnshadowableGlobals({
        localStorage: {
          configurable: true,
          enumerable: true,
          value: prefixedStorage,
          writable: false,
        },
      });

      return () => () => Promise.resolve();
    },
  };
}
