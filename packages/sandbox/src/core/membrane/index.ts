/* eslint-disable no-param-reassign */
import {
  create,
  defineProperty,
  esmInternalPrefix,
  freeze,
  getOwnPropertyDescriptor,
  hasOwnProperty,
  keys,
} from '@qiankunjs/shared';
import { nativeGlobal } from '../../consts';
import { isPropertyFrozen } from '../../utils';
import { globalsInBrowser } from '../globals';
import { array2TruthyObject } from '../utils';
import { rebindTarget2Fn } from './utils';

declare global {
  interface Window {
    __QIANKUN_DEVELOPMENT__?: boolean;
  }
}

export type MembraneTarget = Record<string | symbol, unknown>;
export type Endowments = Record<string, number | string | CallableFunction | PropertyDescriptor>;

type SymbolTarget = 'target' | 'globalContext';

const variableWhiteListInDev =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' || window.__QIANKUN_DEVELOPMENT__
    ? [
        // for react hot reload
        // see https://github.com/facebook/create-react-app/blob/66bf7dfc43350249e2f09d138a20840dae8a0a4a/packages/react-error-overlay/src/index.js#L180
        '__REACT_ERROR_OVERLAY_GLOBAL_HOOK__',
        // for react development event issue, see https://github.com/umijs/qiankun/issues/2375
        'event',
        /*
         * for vite react-refresh dev runtime: its per-module shim assigns window.$RefreshReg$/$RefreshSig$
         * and then reads them back as bare identifiers, which resolve against the real global scope in
         * ESM modules (the destructuring injection cannot express such live bindings, see ESM sandbox RFC §1)
         */
        '$RefreshReg$',
        '$RefreshSig$',
      ]
    : [];
// who could escape the sandbox
const globalVariableWhiteList: string[] = [
  // FIXME System.js used a indirect call with eval, which would make it scope escape to global
  // To make System.js works well, we write it back to global window temporary
  // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/evaluate.js#L106
  'System',

  // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/instantiate.js#L357
  '__cjsWrapper',
  ...variableWhiteListInDev,
];

const useNativeWindowForBindingsProps = new Map<PropertyKey, boolean>([
  ['fetch', true],
  ['mockDomAPIInBlackList', process.env.NODE_ENV === 'test'],
]);

/*
 * qiankun internal globals (like the ESM realm accessor __qk_realm) live on the real globalThis and
 * must be unreachable through the membrane proxy, otherwise a sub app could grab another app's realm
 * and escape its own sandbox (ESM sandbox RFC §1). Reads through the proxy uniformly return undefined,
 * while the per-instance runtime modules access the real globalThis directly and stay unaffected.
 * Own properties of the membrane target (a sub app writing window.__qk_foo itself) are not shielded.
 */
// reuse the single source of truth for the prefix so a rename can never silently unshield the realm
// accessor (the shielded keys are generated from esmInternalPrefix in @qiankunjs/shared)
const isShieldedInternalGlobal = (target: MembraneTarget, p: PropertyKey): boolean =>
  typeof p === 'string' && p.startsWith(esmInternalPrefix) && !hasOwnProperty(target, p);

const isPropertyDescriptor = (v: unknown): boolean => {
  return (
    typeof v === 'object' &&
    v !== null &&
    ['value', 'writable', 'get', 'set', 'configurable', 'enumerable'].some((p) => p in v)
  );
};

const cachedGlobalsInBrowser = array2TruthyObject(
  globalsInBrowser.concat(process.env.NODE_ENV === 'test' ? ['mockNativeWindowFunction'] : []),
);
const isNativeGlobalProp = (prop: string): boolean => {
  return prop in cachedGlobalsInBrowser;
};

export class Membrane {
  private locking = false;

  private readonly modificationListeners = new Set<(p: PropertyKey) => void>();

  modifications = new Set<PropertyKey>();

  realmGlobal: WindowProxy;

  target: MembraneTarget;

  latestSetProp: PropertyKey | undefined;

  /**
   * Subscribe to global property modifications made through the membrane (set/defineProperty/delete).
   * Used by the ESM sandbox engine to refresh the live dunder-global bindings of rewritten modules.
   */
  onModification(listener: (p: PropertyKey) => void): () => void {
    this.modificationListeners.add(listener);
    return () => {
      this.modificationListeners.delete(listener);
    };
  }

  /**
   * A throwing listener must never break the app's global assignment that triggered it —
   * the set/defineProperty/deleteProperty traps were exception-free before listeners existed.
   */
  private notifyModification(p: PropertyKey): void {
    this.modificationListeners.forEach((listener) => {
      try {
        listener(p);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[qiankun] membrane modification listener threw', e);
        }
      }
    });
  }

  constructor(
    incubatorContext: WindowProxy,
    unscopables: Record<string, true>,
    opts?: {
      whitelist?: string[];
      endowments?: Endowments;
    },
  ) {
    const { endowments = {} } = opts || {};
    const whitelistVars = [...(opts?.whitelist || []), ...globalVariableWhiteList];
    const descriptorTargetMap = new Map<PropertyKey, SymbolTarget>();
    const propertiesWithGetter = new Map<PropertyKey, boolean>();
    const target = createMembraneTarget(endowments);

    this.target = target;

    this.realmGlobal = new Proxy(this.target, {
      set: (membraneTarget, p, value: never) => {
        if (!this.locking) {
          // sync the property to incubatorContext
          if (typeof p === 'string' && whitelistVars.indexOf(p) !== -1) {
            // this.globalWhitelistPrevDescriptor[p] = Object.getOwnPropertyDescriptor(incubatorContext, p);
            incubatorContext[p as never] = value;
          } else {
            // We must keep its description while the property existed in incubatorContext before
            if (!hasOwnProperty(membraneTarget, p)) {
              /*
               * never consult the host descriptor for shielded internal keys (e.g. the ESM realm
               * accessor): materializing it would turn the key into an own prop and permanently
               * unshield the real accessor for this app. As the app cannot observe the host key
               * (get/has/getOwnPropertyDescriptor all shield it), the write falls through to the
               * brand-new-own-global branch below instead.
               */
              const descriptor = isShieldedInternalGlobal(membraneTarget, p)
                ? undefined
                : getOwnPropertyDescriptor(incubatorContext, p);
              if (descriptor && !descriptor.configurable) {
                materializeNonConfigurableProperty(membraneTarget, propertiesWithGetter, p, descriptor);
                membraneTarget[p] = value;
              } else if (descriptor) {
                const { writable, configurable, enumerable } = descriptor;
                // only writable property can be overwritten
                // here we ignored accessor descriptor of incubatorContext as it makes no sense to trigger its logic(which might make sandbox escaping instead)
                // we force to set value by data descriptor
                if (writable || hasOwnProperty(descriptor, 'set')) {
                  defineProperty(membraneTarget, p, { configurable, enumerable, writable: true, value });
                }
              } else {
                membraneTarget[p] = value;
              }
            } else {
              membraneTarget[p] = value;
            }
          }

          this.modifications.add(p);

          this.latestSetProp = p;

          // notify subscribers (e.g. the ESM engine refreshing live global bindings)
          this.notifyModification(p);

          return true;
        }

        if (process.env.NODE_ENV === 'development') {
          // console.warn(`[qiankun] Set window.${p.toString()} while sandbox destroyed or inactive in ${name}!`);
          console.warn(`[qiankun] Set window.${p.toString()} while sandbox destroyed or inactive!`);
        }

        // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
        return true;
      },

      get: (membraneTarget, p, receiver) => {
        if (p === Symbol.unscopables) return unscopables;

        if (isShieldedInternalGlobal(membraneTarget, p)) return undefined;

        // properties in endowments returns directly
        if (hasOwnProperty(endowments, p)) {
          return membraneTarget[p];
        }

        if (typeof p === 'string' && whitelistVars.indexOf(p) !== -1) {
          return incubatorContext[p as never];
        }

        const actualTarget = propertiesWithGetter.has(p)
          ? incubatorContext
          : p in membraneTarget
            ? membraneTarget
            : incubatorContext;
        const value = actualTarget[p as never];

        // frozen value should return directly, see https://github.com/umijs/qiankun/issues/2015
        if (isPropertyFrozen(actualTarget, p)) {
          return value;
        }

        // non-native property return directly to avoid rebind
        if (!isNativeGlobalProp(p as string) && !useNativeWindowForBindingsProps.has(p)) {
          return value;
        }

        /* Some dom api must be bound to native window, otherwise it would cause exception like 'TypeError: Failed to execute 'fetch' on 'Window': Illegal invocation'
         See this code:
           const proxy = new Proxy(window, {});
           const proxyFetch = fetch.bind(proxy);
           proxyFetch('https://qiankun.com');
      */
        const boundTarget = useNativeWindowForBindingsProps.get(p) ? nativeGlobal : incubatorContext;
        return rebindTarget2Fn(boundTarget, value, receiver);
      },

      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has(membraneTarget: MembraneTarget, p: string | number | symbol): boolean {
        if (isShieldedInternalGlobal(membraneTarget, p)) return false;

        return p in membraneTarget || p in incubatorContext;
      },

      getOwnPropertyDescriptor(
        membraneTarget: MembraneTarget,
        p: string | number | symbol,
      ): PropertyDescriptor | undefined {
        /*
         * Proxy invariants require a non-configurable property to exist on the target before its
         * descriptor is returned. Mirror only the requested property instead of scanning every
         * property on the host window while constructing each sandbox.
         */
        if (hasOwnProperty(membraneTarget, p)) {
          const descriptor = getOwnPropertyDescriptor(membraneTarget, p);
          descriptorTargetMap.set(p, 'target');
          return descriptor;
        }

        if (isShieldedInternalGlobal(membraneTarget, p)) return undefined;

        const descriptor = getOwnPropertyDescriptor(incubatorContext, p);
        if (descriptor) {
          if (!descriptor.configurable) {
            materializeNonConfigurableProperty(membraneTarget, propertiesWithGetter, p, descriptor);
            descriptorTargetMap.set(p, 'target');
            return getOwnPropertyDescriptor(membraneTarget, p);
          }

          descriptorTargetMap.set(p, 'globalContext');
          return descriptor;
        }

        return undefined;
      },

      // trap to support iterator with sandbox
      ownKeys(membraneTarget: MembraneTarget): ArrayLike<string | symbol> {
        return uniq(
          Reflect.ownKeys(incubatorContext)
            .filter((p) => !isShieldedInternalGlobal(membraneTarget, p))
            .concat(Reflect.ownKeys(membraneTarget)),
        );
      },

      defineProperty: (membraneTarget, p, attributes) => {
        let from = descriptorTargetMap.get(p);
        if (!from && !hasOwnProperty(membraneTarget, p) && !isShieldedInternalGlobal(membraneTarget, p)) {
          const descriptor = getOwnPropertyDescriptor(incubatorContext, p);
          if (descriptor && !descriptor.configurable) {
            materializeNonConfigurableProperty(membraneTarget, propertiesWithGetter, p, descriptor);
            from = 'target';
          }
        }
        /*
         Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
         otherwise it would cause a TypeError with illegal invocation.
         */
        const result =
          from === 'globalContext'
            ? Reflect.defineProperty(incubatorContext, p, attributes)
            : Reflect.defineProperty(membraneTarget, p, attributes);

        if (result && !this.locking) {
          this.notifyModification(p);
        }

        return result;
      },

      deleteProperty: (membraneTarget, p) => {
        if (!hasOwnProperty(membraneTarget, p) && !isShieldedInternalGlobal(membraneTarget, p)) {
          const descriptor = getOwnPropertyDescriptor(incubatorContext, p);
          if (descriptor && !descriptor.configurable) {
            materializeNonConfigurableProperty(membraneTarget, propertiesWithGetter, p, descriptor);
          }
        }

        if (hasOwnProperty(membraneTarget, p)) {
          delete membraneTarget[p];
          this.modifications.delete(p);

          // deletions must refresh live bindings too, or modules keep reading the deleted value
          if (!this.locking) {
            this.notifyModification(p);
          }

          return true;
        }

        return true;
      },

      // makes sure `window instanceof Window` returns truthy in micro app
      getPrototypeOf() {
        return Reflect.getPrototypeOf(incubatorContext);
      },
    }) as unknown as WindowProxy;
  }

  addIntrinsics(
    intrinsics:
      Record<string, PropertyDescriptor> | ((rawTarget: MembraneTarget) => Record<string, PropertyDescriptor>),
  ): void {
    const intrinsicsObj = typeof intrinsics === 'function' ? intrinsics(this.target) : intrinsics;
    keys(intrinsicsObj).forEach((key) => {
      defineProperty(this.target, key, intrinsicsObj[key]);
    });
  }

  lock() {
    this.locking = true;
  }

  unlock() {
    this.locking = false;
  }
}

function createMembraneTarget(endowments: Endowments = {}): MembraneTarget {
  return keys(endowments).reduce((target, key) => {
    const value = endowments[key];
    if (isPropertyDescriptor(value)) {
      defineProperty(target, key, value);
    } else {
      target[key] = value;
    }
    return target;
  }, {} as MembraneTarget);
}

function materializeNonConfigurableProperty(
  target: MembraneTarget,
  propertiesWithGetter: Map<PropertyKey, boolean>,
  property: PropertyKey,
  descriptor: PropertyDescriptor,
): void {
  if (hasOwnProperty(descriptor, 'get')) {
    propertiesWithGetter.set(property, true);
  }

  defineProperty(
    target,
    property,
    // freeze the descriptor to avoid being modified by zone.js
    // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71
    freeze(descriptor),
  );
}

/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */
function uniq(array: Array<string | symbol>) {
  return array.filter(function (this: Record<string | symbol, boolean>, element) {
    return element in this ? false : (this[element] = true);
  }, create(null));
}
