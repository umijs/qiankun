/* eslint-disable @typescript-eslint/unbound-method */
/**
 * @author Kuitos
 * @since 2020-10-13
 */

import { Deferred, QiankunError, transpileStyleRule } from '@qiankunjs/shared';
import { nativeDocument, nativeGlobal, qiankunHeadTagName } from '../../consts';
import { rebindTarget2Fn } from '../../core/utils';
import type { Free, IsolationPluginContext } from '../types';
import {
  getContainerBodyElement,
  getContainerHeadElement,
  getNewRemoveChild,
  getOverwrittenAppendChildOrInsertBefore,
  rebuildCSSRules,
  recordStyledComponentsCSSRules,
  styleElementRefNodeNo,
  styleElementTargetSymbol,
} from './common';
import type { SandboxConfig } from './types';

type PluginCompartment = IsolationPluginContext['compartment'];
type Unpatch = () => void;

declare global {
  interface Window {
    __currentLockingSandbox__?: PluginCompartment;
  }

  interface Document {
    [p: string]: unknown;
  }
}

Object.defineProperty(nativeGlobal, '__currentLockingSandbox__', {
  enumerable: false,
  writable: true,
  configurable: true,
});

interface DOMPrototypePatchState {
  refCount: number;
  nativeMutationObserverObserve: typeof MutationObserver.prototype.observe;
  patchedMutationObserverObserve: typeof MutationObserver.prototype.observe;
  nativeCompareDocumentPosition: typeof Node.prototype.compareDocumentPosition;
  patchedCompareDocumentPosition: typeof Node.prototype.compareDocumentPosition;
}

interface CSSOMPatchState {
  refCount: number;
  nativeInsertRule: typeof CSSStyleSheet.prototype.insertRule;
  patchedInsertRule: typeof CSSStyleSheet.prototype.insertRule;
}

interface DynamicAppendSharedState {
  sandboxConfigs: WeakMap<object, SandboxConfig>;
  elementConfigs: WeakMap<HTMLElement, SandboxConfig>;
  containerOwners: WeakMap<HTMLElement, PluginCompartment>;
  domPrototypePatch?: DOMPrototypePatchState;
  cssomPatch?: CSSOMPatchState;
}

/**
 * Prototype patches must be coordinated by the browser realm rather than by a
 * package module. Symbol.for lets independently bundled qiankun copies share
 * the same ref counts and element ownership metadata.
 */
const sharedStateSymbol = Symbol.for('qiankun.dynamicAppend.sharedState');
const sharedState = (() => {
  const existingState = Reflect.get(nativeGlobal, sharedStateSymbol) as DynamicAppendSharedState | undefined;
  if (existingState) return existingState;

  const state: DynamicAppendSharedState = {
    sandboxConfigs: new WeakMap(),
    elementConfigs: new WeakMap(),
    containerOwners: new WeakMap(),
  };
  Object.defineProperty(nativeGlobal, sharedStateSymbol, {
    configurable: true,
    enumerable: false,
    value: state,
    writable: false,
  });
  return state;
})();

const { containerOwners, elementConfigs, sandboxConfigs } = sharedState;

const getSandboxConfig = (element: HTMLElement) => elementConfigs.get(element);
const setSandboxConfig = (element: HTMLElement, config: SandboxConfig) => elementConfigs.set(element, config);

function patchDocument(compartment: PluginCompartment, appName: string, getContainer: () => HTMLElement): Unpatch {
  const container = getContainer();
  // dom container might be reused by multiple apps,
  // thus we check its attached sandbox is same with current to avoid duplicate patch
  if (containerOwners.get(container) === compartment) {
    return () => {};
  }

  const unpatch = patchDocumentHeadAndBodyMethods(container, compartment);

  const attachElementToSandbox = (element: HTMLElement) => {
    const sandboxConfig = sandboxConfigs.get(compartment);
    if (sandboxConfig) {
      elementConfigs.set(element, sandboxConfig);
    }
  };
  const getDocumentHeadElement = () => {
    const currentContainer = getContainer();
    const containerHeadElement = getContainerHeadElement(currentContainer);
    if (!containerHeadElement) {
      throw new QiankunError(`${appName} head element not existed while accessing document.head!`);
    }
    return containerHeadElement;
  };
  const getDocumentBodyElement = () => {
    const currentContainer = getContainer();
    return getContainerBodyElement(currentContainer);
  };
  const modificationFns: {
    createElement?: typeof document.createElement;
    querySelector?: typeof document.querySelector;
  } = {};
  const proxyDocument = new Proxy(document, {
    /**
     * Read and write must be paired, otherwise the write operation will leak to the global
     */
    set: (target, p, value: unknown) => {
      switch (p) {
        case 'createElement': {
          modificationFns.createElement = value as typeof document.createElement;
          break;
        }
        case 'querySelector': {
          modificationFns.querySelector = value as typeof document.querySelector;
          break;
        }
        default:
          target[p as keyof Document] = value;
          break;
      }

      return true;
    },
    get: (target, p, receiver) => {
      switch (p) {
        case 'createElement': {
          // Must store the original createElement function to avoid error in nested sandbox
          const targetCreateElement = modificationFns.createElement || target.createElement;
          return function createElement(...args: Parameters<typeof document.createElement>) {
            if (!nativeGlobal.__currentLockingSandbox__) {
              nativeGlobal.__currentLockingSandbox__ = compartment;
            }

            const element = targetCreateElement.call(target, ...args);

            // only record the element which is created by the current sandbox, thus we can avoid the element created by nested sandboxes
            if (nativeGlobal.__currentLockingSandbox__ === compartment) {
              attachElementToSandbox(element);
              delete nativeGlobal.__currentLockingSandbox__;
            }

            return element;
          };
        }

        case 'querySelector': {
          const targetQuerySelector = modificationFns.querySelector || target.querySelector;
          return function querySelector(...args: Parameters<typeof document.querySelector>) {
            const selector = args[0];
            switch (selector) {
              case 'head': {
                return getDocumentHeadElement();
              }

              case 'body': {
                return getDocumentBodyElement();
              }
            }

            return targetQuerySelector.call(target, ...args);
          };
        }

        case 'head': {
          return getDocumentHeadElement();
        }

        case 'body': {
          return getDocumentBodyElement();
        }

        default:
          break;
      }

      const value = target[p as keyof Document];
      // must rebind the function to the target otherwise it will cause illegal invocation error
      return rebindTarget2Fn(target, value, receiver);
    },
  });

  compartment.defineUnshadowableGlobals({
    document: { value: proxyDocument, writable: false, enumerable: true, configurable: true },
  });

  containerOwners.set(container, compartment);

  return () => {
    unpatch();
    if (containerOwners.get(container) === compartment) {
      containerOwners.delete(container);
    }
  };
}

function patchDocumentHeadAndBodyMethods(container: HTMLElement, compartment: PluginCompartment): Unpatch {
  // tag the mount points with the owning app config, so fragment-wrapped children (parsed via
  // innerHTML rather than the sandboxed createElement) can inherit it during decomposition
  const tagMountPoint = (mountPoint: HTMLElement) => {
    const sandboxConfig = sandboxConfigs.get(compartment);
    if (sandboxConfig) setSandboxConfig(mountPoint, sandboxConfig);
  };

  let patchedHeadMethods:
    | {
        appendChild: typeof document.head.appendChild;
        insertBefore: typeof document.head.insertBefore;
        removeChild: typeof document.head.removeChild;
      }
    | undefined;
  const patchHeadElementMethod = (headElement: HTMLHeadElement) => {
    tagMountPoint(headElement);
    patchedHeadMethods = {
      appendChild: getOverwrittenAppendChildOrInsertBefore(
        document.head.appendChild,
        getSandboxConfig,
        'head',
        setSandboxConfig,
      ),
      insertBefore: getOverwrittenAppendChildOrInsertBefore(
        document.head.insertBefore,
        getSandboxConfig,
        'head',
        setSandboxConfig,
      ),
      removeChild: getNewRemoveChild(document.head.removeChild, getSandboxConfig),
    };
    Object.assign(headElement, patchedHeadMethods);
  };
  let containerHeadElement = getContainerHeadElement(container);
  let observer: MutationObserver | undefined;
  if (!containerHeadElement) {
    // patch container head element after it is mounted
    observer = new MutationObserver(() => {
      containerHeadElement = getContainerHeadElement(container);
      if (containerHeadElement) {
        patchHeadElementMethod(containerHeadElement);
        observer?.disconnect();
      }
    });
    observer.observe(container, { subtree: true, childList: true });
  } else {
    patchHeadElementMethod(containerHeadElement);
  }

  const containerBodyElement = container;
  tagMountPoint(containerBodyElement);
  const patchedBodyMethods = {
    appendChild: getOverwrittenAppendChildOrInsertBefore(
      document.body.appendChild,
      getSandboxConfig,
      'body',
      setSandboxConfig,
    ),
    insertBefore: getOverwrittenAppendChildOrInsertBefore(
      document.head.insertBefore,
      getSandboxConfig,
      'body',
      setSandboxConfig,
    ),
    removeChild: getNewRemoveChild(document.body.removeChild, getSandboxConfig),
  };
  Object.assign(containerBodyElement, patchedBodyMethods);

  return () => {
    observer?.disconnect();
    if (containerHeadElement && patchedHeadMethods) {
      if (containerHeadElement.appendChild === patchedHeadMethods.appendChild) {
        Reflect.deleteProperty(containerHeadElement, 'appendChild');
      }
      if (containerHeadElement.insertBefore === patchedHeadMethods.insertBefore) {
        Reflect.deleteProperty(containerHeadElement, 'insertBefore');
      }
      if (containerHeadElement.removeChild === patchedHeadMethods.removeChild) {
        Reflect.deleteProperty(containerHeadElement, 'removeChild');
      }
    }

    if (containerBodyElement.appendChild === patchedBodyMethods.appendChild) {
      Reflect.deleteProperty(containerBodyElement, 'appendChild');
    }
    if (containerBodyElement.insertBefore === patchedBodyMethods.insertBefore) {
      Reflect.deleteProperty(containerBodyElement, 'insertBefore');
    }
    if (containerBodyElement.removeChild === patchedBodyMethods.removeChild) {
      Reflect.deleteProperty(containerBodyElement, 'removeChild');
    }
  };
}

function patchDOMPrototypeFns(): Unpatch {
  let state = sharedState.domPrototypePatch;
  if (!state) {
    // patch MutationObserver.prototype.observe to avoid type error
    // https://github.com/umijs/qiankun/issues/2406
    const nativeMutationObserverObserve = MutationObserver.prototype.observe;
    const patchedMutationObserverObserve = function observe(
      this: MutationObserver,
      target: Node,
      options: MutationObserverInit,
    ) {
      const realTarget = target instanceof Document ? nativeDocument : target;
      return nativeMutationObserverObserve.call(this, realTarget, options);
    };

    // patch Node.prototype.compareDocumentPosition to avoid type error
    const nativeCompareDocumentPosition = Node.prototype.compareDocumentPosition;
    const patchedCompareDocumentPosition = function compareDocumentPosition(this: Node, node: Node) {
      const realNode = node instanceof Document ? nativeDocument : node;
      return nativeCompareDocumentPosition.call(this, realNode);
    };

    state = {
      refCount: 0,
      nativeMutationObserverObserve,
      patchedMutationObserverObserve,
      nativeCompareDocumentPosition,
      patchedCompareDocumentPosition,
    };
    sharedState.domPrototypePatch = state;
    MutationObserver.prototype.observe = patchedMutationObserverObserve;
    Node.prototype.compareDocumentPosition = patchedCompareDocumentPosition;
  }

  state.refCount += 1;

  // TODO https://github.com/umijs/qiankun/pull/2415 Not support yet as getCurrentRunningApp api is not reliable
  // patch parentNode getter to avoid document === html.parentNode
  // https://github.com/umijs/qiankun/issues/2408#issuecomment-1446229105
  // const parentNodeDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode');
  // if (parentNodeDescriptor) {
  //   const { get: parentNodeGetter, configurable } = parentNodeDescriptor;
  //   if (parentNodeGetter && configurable) {
  //     const patchedParentNodeDescriptor = {
  //       ...parentNodeDescriptor,
  //       get(this: Node) {
  //         const parentNode = parentNodeGetter.call(this) as HTMLElement;
  //         if (parentNode instanceof Document) {
  //           const proxy = getCurrentRunningApp()?.window;
  //           if (proxy) {
  //             return proxy.document;
  //           }
  //         }
  //
  //         return parentNode;
  //       },
  //     };
  //     Object.defineProperty(Node.prototype, 'parentNode', patchedParentNodeDescriptor);
  //
  //   }
  // }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.refCount -= 1;
    if (state.refCount > 0) return;

    // Do not clobber a host patch installed after qiankun's patch.
    if (MutationObserver.prototype.observe === state.patchedMutationObserverObserve) {
      MutationObserver.prototype.observe = state.nativeMutationObserverObserve;
    }
    if (Node.prototype.compareDocumentPosition === state.patchedCompareDocumentPosition) {
      Node.prototype.compareDocumentPosition = state.nativeCompareDocumentPosition;
    }
    if (sharedState.domPrototypePatch === state) {
      delete sharedState.domPrototypePatch;
    }

    // if (parentNodeDescriptor) {
    //   Object.defineProperty(Node.prototype, 'parentNode', parentNodeDescriptor);
    // }
  };
}

// FIXME should not use global variable, should get it every time it is used, otherwise it may miss the runtime container or the business itself monkey patch logic
const rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
const rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;

function patchCSSOM(): Unpatch {
  let state = sharedState.cssomPatch;
  if (!state) {
    const nativeInsertRule = CSSStyleSheet.prototype.insertRule;
    const patchedInsertRule = function insertRule(this: CSSStyleSheet, rule: string, index?: number): number {
      const ownerNode = this.ownerNode as HTMLElement | null;
      if (ownerNode) {
        const config = elementConfigs.get(ownerNode);
        if (config?.styleIsolation) {
          const scopedRule = transpileStyleRule(rule, config.styleIsolation);
          return nativeInsertRule.call(this, scopedRule, index);
        }
      }
      return nativeInsertRule.call(this, rule, index);
    };

    state = { refCount: 0, nativeInsertRule, patchedInsertRule };
    sharedState.cssomPatch = state;
    CSSStyleSheet.prototype.insertRule = patchedInsertRule;
  }

  state.refCount += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.refCount -= 1;
    if (state.refCount > 0) return;

    // Preserve patches installed by the host after qiankun initialized.
    if (CSSStyleSheet.prototype.insertRule === state.patchedInsertRule) {
      CSSStyleSheet.prototype.insertRule = state.nativeInsertRule;
    }
    if (sharedState.cssomPatch === state) {
      delete sharedState.cssomPatch;
    }
  };
}

export function patchStandardSandbox(context: IsolationPluginContext): Free {
  const { appName, compartment, getContainer, config } = context;
  const { nodeTransformer, fetch, styleIsolation } = config;
  let sandboxConfig = sandboxConfigs.get(compartment);
  if (!sandboxConfig) {
    sandboxConfig = {
      appName,
      compartment,
      fetch,
      nodeTransformer,
      styleIsolation,
      dynamicStyleSheetElements: [],
      dynamicExternalSyncScriptDeferredList: [],
    };
    sandboxConfigs.set(compartment, sandboxConfig);
  }
  // all dynamic style sheets are stored in proxy container
  const { dynamicStyleSheetElements } = sandboxConfig;

  const unpatchDocument = patchDocument(compartment, appName, getContainer);
  const unpatchDOMPrototype = patchDOMPrototypeFns();
  const unpatchCSSOM = styleIsolation ? patchCSSOM() : undefined;

  let released = false;
  return function free() {
    if (!released) {
      released = true;
      // release the overwritten document
      unpatchDocument();

      unpatchCSSOM?.();
      unpatchDOMPrototype();
    }

    recordStyledComponentsCSSRules(dynamicStyleSheetElements);

    // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet could be removed automatically while unmounting
    return (container: HTMLElement) => attachRecordedStylesheets(appName, dynamicStyleSheetElements, container);
  };
}

async function attachRecordedStylesheets(
  appName: string,
  dynamicStyleSheetElements: SandboxConfig['dynamicStyleSheetElements'],
  container: HTMLElement,
): Promise<void> {
  const isElementExisted = (element: HTMLStyleElement | HTMLLinkElement) => {
    if (container.contains(element)) return true;
    if ('rel' in element && element.rel === 'stylesheet' && element.href)
      return !!container.querySelector(`link[rel=stylesheet][href="${element.href}"]`);
    return false;
  };

  await Promise.all(
    rebuildCSSRules(dynamicStyleSheetElements, async (stylesheetElement) => {
      if (!isElementExisted(stylesheetElement)) {
        const mountDom =
          stylesheetElement[styleElementTargetSymbol] === 'head'
            ? (() => {
                const containerHeadElement = getContainerHeadElement(container);
                if (!containerHeadElement) {
                  throw new QiankunError(
                    `${appName} container ${qiankunHeadTagName} element not ready while rebuilding!`,
                  );
                }
                return containerHeadElement;
              })()
            : container;

        let styleElement = stylesheetElement;

        const deferred = new Deferred<boolean>();
        if ('rel' in styleElement && styleElement.rel === 'stylesheet' && styleElement.href) {
          // micro app rendering should wait unit the rebuilding link element is loaded, otherwise it may cause style blink
          // As one external link element will just trigger loaded event once, although we append it multiple times, we need to clone it before every appending
          styleElement = styleElement.cloneNode(true) as HTMLLinkElement;
          styleElement.onload = () => deferred.resolve(true);
          styleElement.onerror = () => deferred.resolve(false);
        } else {
          deferred.resolve(true);
        }

        const refNo = stylesheetElement[styleElementRefNodeNo];
        if (typeof refNo === 'number' && refNo !== -1) {
          // the reference node may be dynamic script comment which is not rebuilt while remounting thus reference node no longer exists
          // in this case, we should append the style element to the end of mountDom
          const refNode = mountDom.childNodes[refNo];
          rawHeadInsertBefore.call(mountDom, styleElement, refNode);
        } else {
          rawHeadAppendChild.call(mountDom, styleElement);
        }

        return deferred.promise;
      }

      return false;
    }),
  );
}

/**
 * Re-attach recorded dynamic stylesheets that are no longer connected to the container.
 *
 * Covers the first-mount-after-wipe race: when app X starts loading while app Y still occupies the
 * shared container, Y's unmount clears the DOM X streamed during its loading phase — including the
 * stylesheets X's scripts injected dynamically (e.g. Vite dev CSS-as-JS modules). X itself has never
 * been unmounted, so no rebuild was captured for it; without this pass those styles are lost while
 * the (cached, never re-executed) modules believe they are still attached. Idempotent for the regular
 * remount path: already-attached elements are skipped.
 */
export function reattachDynamicStylesheets(compartment: PluginCompartment, container: HTMLElement): Promise<void> {
  const sandboxConfig = sandboxConfigs.get(compartment);
  if (!sandboxConfig) return Promise.resolve();
  return attachRecordedStylesheets(sandboxConfig.appName, sandboxConfig.dynamicStyleSheetElements, container);
}
