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

function getRequiredContainer(getContainer: IsolationPluginContext['getContainer'], appName: string): HTMLElement {
  const container = getContainer();
  if (!container) {
    throw new QiankunError(`${appName} requires a container for DOM isolation`);
  }
  return container;
}

declare global {
  interface Document {
    [p: string]: unknown;
  }
}

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

/**
 * Ownership follows the stylesheet's current DOM position, consistent with the insertion-point
 * attribution model: a style inserted through a patched mount point already carries its config,
 * while one injected deeper inside a container (e.g. a CSS-in-JS custom insertion target)
 * resolves to the nearest tagged ancestor — the mount points are always tagged. The resolution
 * is cached back onto the element, so insertRule-heavy CSS-in-JS paths walk at most once.
 */
const resolveStyleOwnerConfig = (ownerNode: HTMLElement): SandboxConfig | undefined => {
  const attachedConfig = elementConfigs.get(ownerNode);
  if (attachedConfig) return attachedConfig;

  let ancestor = ownerNode.parentElement;
  while (ancestor) {
    const ancestorConfig = elementConfigs.get(ancestor);
    if (ancestorConfig) {
      elementConfigs.set(ownerNode, ancestorConfig);
      return ancestorConfig;
    }
    ancestor = ancestor.parentElement;
  }
  return undefined;
};

// Deliberately captured from Node.prototype at module load: an instance lookup like
// document.head.appendChild could pick up a host page's instance-level patch and leak it into
// container operations with the wrong receiver. An app monkey-patching the appendChild *it*
// sees stays effective regardless — its wrapper shadows our patched instance method on the
// mount point and delegates to it, so the pipeline runs underneath the wrapper (pinned by the
// patched-append e2e). Only prototype patches installed after this module loads are bypassed.
const nativeAppendChild = Node.prototype.appendChild;
const nativeInsertBefore = Node.prototype.insertBefore;
const nativeRemoveChild = Node.prototype.removeChild;

function patchDocument(
  compartment: PluginCompartment,
  appName: string,
  getContainer: IsolationPluginContext['getContainer'],
): Unpatch {
  const container = getRequiredContainer(getContainer, appName);
  // dom container might be reused by multiple apps,
  // thus we check its attached sandbox is same with current to avoid duplicate patch
  if (containerOwners.get(container) === compartment) {
    return () => {};
  }

  const unpatch = patchDocumentHeadAndBodyMethods(container, compartment);

  const getDocumentHeadElement = () => {
    const currentContainer = getRequiredContainer(getContainer, appName);
    const containerHeadElement = getContainerHeadElement(currentContainer);
    if (!containerHeadElement) {
      throw new QiankunError(`${appName} head element not existed while accessing document.head!`);
    }
    return containerHeadElement;
  };
  const getDocumentBodyElement = () => {
    const currentContainer = getRequiredContainer(getContainer, appName);
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
          // Ownership is decided at insertion time (insertion-point attribution), so creation
          // needs no bookkeeping anymore — only the app-level override recorded by the paired
          // setter must keep being honored.
          const targetCreateElement = modificationFns.createElement || target.createElement;
          return function createElement(...args: Parameters<typeof document.createElement>) {
            return targetCreateElement.call(target, ...args);
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
  // A follow-up app may have re-tagged a shared mount point, so only clear this app's own stamp —
  // otherwise a disposed sandbox could still be resolved as a style owner by DOM position.
  const untagMountPoint = (mountPoint: HTMLElement) => {
    if (elementConfigs.get(mountPoint) === sandboxConfigs.get(compartment)) {
      elementConfigs.delete(mountPoint);
    }
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
        nativeAppendChild,
        getSandboxConfig,
        'head',
        setSandboxConfig,
      ),
      insertBefore: getOverwrittenAppendChildOrInsertBefore(
        nativeInsertBefore,
        getSandboxConfig,
        'head',
        setSandboxConfig,
      ),
      removeChild: getNewRemoveChild(nativeRemoveChild, getSandboxConfig),
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
    appendChild: getOverwrittenAppendChildOrInsertBefore(nativeAppendChild, getSandboxConfig, 'body', setSandboxConfig),
    insertBefore: getOverwrittenAppendChildOrInsertBefore(
      nativeInsertBefore,
      getSandboxConfig,
      'body',
      setSandboxConfig,
    ),
    removeChild: getNewRemoveChild(nativeRemoveChild, getSandboxConfig),
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
      untagMountPoint(containerHeadElement);
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
    untagMountPoint(containerBodyElement);
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

function patchCSSOM(): Unpatch {
  let state = sharedState.cssomPatch;
  if (!state) {
    const nativeInsertRule = CSSStyleSheet.prototype.insertRule;
    const patchedInsertRule = function insertRule(this: CSSStyleSheet, rule: string, index?: number): number {
      const ownerNode = this.ownerNode as HTMLElement | null;
      if (ownerNode) {
        const config = resolveStyleOwnerConfig(ownerNode);
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
    return (container?: HTMLElement) => {
      if (!container) {
        return Promise.reject(new QiankunError(`${appName} requires a container while rebuilding DOM side effects`));
      }
      return attachRecordedStylesheets(appName, dynamicStyleSheetElements, container);
    };
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
          nativeInsertBefore.call(mountDom, styleElement, refNode);
        } else {
          nativeAppendChild.call(mountDom, styleElement);
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
