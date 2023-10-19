/* eslint-disable @typescript-eslint/unbound-method */
/**
 * @author Kuitos
 * @since 2020-10-13
 */

import { nativeDocument, nativeGlobal } from '../../consts';
import type { Sandbox } from '../../core/sandbox';
import { isBoundedFunction, isCallable } from '../../utils';
import type { Free } from '../types';
import {
  calcAppCount,
  getContainerHeadElement,
  isAllAppsUnmounted,
  patchHTMLDynamicAppendPrototypeFunctions,
  rebuildCSSRules,
  recordStyledComponentsCSSRules,
  styleElementRefNodeNo,
  styleElementTargetSymbol,
} from './common';
import type { SandboxConfig } from './types';

const elementAttachedSymbol = Symbol('attachedApp');
declare global {
  interface HTMLElement {
    [elementAttachedSymbol]: string;
  }

  interface Window {
    __sandboxConfigWeakMap__?: WeakMap<Sandbox, SandboxConfig>;
    __currentLockingSandbox__?: Sandbox;
  }

  interface Document {
    [p: string]: unknown;
  }
}

// Get native global window with a sandbox disgusted way, thus we could share it between qiankun instances🤪
Object.defineProperty(nativeGlobal, '__sandboxConfigWeakMap__', { enumerable: false, writable: true });

Object.defineProperty(nativeGlobal, '__currentLockingSandbox__', {
  enumerable: false,
  writable: true,
  configurable: true,
});

const rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
const rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;

// Share sandboxConfigWeakMap between multiple qiankun instance, thus they could access the same record
nativeGlobal.__sandboxConfigWeakMap__ = nativeGlobal.__sandboxConfigWeakMap__ || new WeakMap<Sandbox, SandboxConfig>();
const sandboxConfigWeakMap = nativeGlobal.__sandboxConfigWeakMap__;

const elementAttachSandboxConfigMap = new WeakMap<HTMLElement, SandboxConfig>();
const patchMap = new WeakMap<object, unknown>();

function patchDocument(sandbox: Sandbox) {
  const attachElementToSandbox = (element: HTMLElement) => {
    const sandboxConfig = sandboxConfigWeakMap.get(sandbox);
    if (sandboxConfig) {
      elementAttachSandboxConfigMap.set(element, sandboxConfig);
    }
  };

  const proxyDocument = new Proxy(document, {
    set: (target, p, value) => {
      target[p as string] = value;
      return true;
    },
    get: (target, p, receiver) => {
      switch (p) {
        case 'createElement': {
          // Must store the original createElement function to avoid error in nested sandbox
          const targetCreateElement = target.createElement;
          return function createElement(...args: Parameters<typeof document.createElement>) {
            if (!nativeGlobal.__currentLockingSandbox__) {
              nativeGlobal.__currentLockingSandbox__ = sandbox;
            }

            const element = targetCreateElement.call(target, ...args);

            // only record the element which is created by the current sandbox, thus we can avoid the element created by nested sandboxes
            if (nativeGlobal.__currentLockingSandbox__ === sandbox) {
              attachElementToSandbox(element);
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              delete nativeGlobal.__currentLockingSandbox__;
            }

            return element;
          };
        }

        case 'querySelector': {
          const targetQuerySelector = target.querySelector;
          return function querySelector(...args: Parameters<typeof document.querySelector>) {
            const selector = args[0];
            switch (selector) {
              case 'head': {
                const containerConfig = sandboxConfigWeakMap.get(sandbox);
                if (containerConfig) {
                  const qiankunHead = getContainerHeadElement(containerConfig.getContainer());

                  // proxied head in micro app should use the proxied appendChild/removeChild/insertBefore methods
                  qiankunHead.appendChild = HTMLHeadElement.prototype.appendChild;
                  qiankunHead.insertBefore = HTMLHeadElement.prototype.insertBefore;
                  qiankunHead.removeChild = HTMLHeadElement.prototype.removeChild;

                  return qiankunHead;
                }
                break;
              }
            }

            return targetQuerySelector.call(target, ...args);
          };
        }
        default:
          break;
      }

      const value = target[p as string];
      // must rebind the function to the target otherwise it will cause illegal invocation error
      if (isCallable(value) && !isBoundedFunction(value)) {
        return function proxyFunction(...args: unknown[]): unknown {
          return Function.prototype.apply.call(
            value,
            target,
            args.map((arg) => (arg === receiver ? target : arg)),
          );
        };
      }

      return value;
    },
  });

  sandbox.addIntrinsics({ document: { value: proxyDocument, writable: false, enumerable: true, configurable: true } });

  // patch MutationObserver.prototype.observe to avoid type error
  // https://github.com/umijs/qiankun/issues/2406
  const nativeMutationObserverObserveFn = MutationObserver.prototype.observe;
  if (!patchMap.has(nativeMutationObserverObserveFn)) {
    const observe = function observe(this: MutationObserver, target: Node, options: MutationObserverInit) {
      const realTarget = target instanceof Document ? nativeDocument : target;
      return nativeMutationObserverObserveFn.call(this, realTarget, options);
    };

    MutationObserver.prototype.observe = observe;
    patchMap.set(nativeMutationObserverObserveFn, observe);
  }

  // patch Node.prototype.compareDocumentPosition to avoid type error
  const prevCompareDocumentPosition = Node.prototype.compareDocumentPosition;
  if (!patchMap.has(prevCompareDocumentPosition)) {
    Node.prototype.compareDocumentPosition = function compareDocumentPosition(this: Node, node) {
      const realNode = node instanceof Document ? nativeDocument : node;
      return prevCompareDocumentPosition.call(this, realNode);
    };
    patchMap.set(prevCompareDocumentPosition, Node.prototype.compareDocumentPosition);
  }

  // TODO https://github.com/umijs/qiankun/pull/2415 Not support yet as getCurrentRunningApp api is not reliable
  // patch parentNode getter to avoid document === html.parentNode
  // https://github.com/umijs/qiankun/issues/2408#issuecomment-1446229105
  // const parentNodeDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode');
  // if (parentNodeDescriptor && !patchMap.has(parentNodeDescriptor)) {
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
  //     patchMap.set(parentNodeDescriptor, patchedParentNodeDescriptor);
  //   }
  // }

  return () => {
    MutationObserver.prototype.observe = nativeMutationObserverObserveFn;
    patchMap.delete(nativeMutationObserverObserveFn);

    Node.prototype.compareDocumentPosition = prevCompareDocumentPosition;
    patchMap.delete(prevCompareDocumentPosition);

    // if (parentNodeDescriptor) {
    //   Object.defineProperty(Node.prototype, 'parentNode', parentNodeDescriptor);
    //   patchMap.delete(parentNodeDescriptor);
    // }
  };
}

export function patchStandardSandbox(
  appName: string,
  getContainer: () => HTMLElement,
  opts: {
    sandbox: Sandbox;
    mounting?: boolean;
  },
): Free {
  const { sandbox, mounting = true } = opts;
  let sandboxConfig = sandboxConfigWeakMap.get(sandbox);
  if (!sandboxConfig) {
    sandboxConfig = {
      appName,
      sandbox,
      getContainer: getContainer,
      dynamicStyleSheetElements: [],
    };
    sandboxConfigWeakMap.set(sandbox, sandboxConfig);
  }
  // all dynamic style sheets are stored in proxy container
  const { dynamicStyleSheetElements } = sandboxConfig;

  const unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(
    (element) => elementAttachSandboxConfigMap.has(element),
    (element) => elementAttachSandboxConfigMap.get(element)!,
  );

  const unpatchDocument = patchDocument(sandbox);

  if (!mounting) calcAppCount(appName, 'increase', 'bootstrapping');
  if (mounting) calcAppCount(appName, 'increase', 'mounting');

  return function free() {
    if (!mounting) calcAppCount(appName, 'decrease', 'bootstrapping');
    if (mounting) calcAppCount(appName, 'decrease', 'mounting');

    // release the overwritten prototype after all the micro apps unmounted
    if (isAllAppsUnmounted()) {
      unpatchDynamicAppendPrototypeFunctions();
      unpatchDocument();
    }

    recordStyledComponentsCSSRules(dynamicStyleSheetElements as HTMLStyleElement[]);

    // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmounting

    return function rebuild() {
      rebuildCSSRules(dynamicStyleSheetElements as HTMLStyleElement[], (stylesheetElement) => {
        const container = getContainer();
        if (!container.contains(stylesheetElement)) {
          const mountDom =
            stylesheetElement[styleElementTargetSymbol] === 'head' ? getContainerHeadElement(container) : container;

          const refNo = stylesheetElement[styleElementRefNodeNo];
          if (typeof refNo === 'number' && refNo !== -1) {
            // the reference node may be dynamic script comment which is not rebuilt while remounting thus reference node no longer exists
            // in this case, we should append the style element to the end of mountDom
            const refNode = mountDom.childNodes[refNo];
            rawHeadInsertBefore.call(mountDom, stylesheetElement, refNode);
            return true;
          }

          rawHeadAppendChild.call(mountDom, stylesheetElement);
          return true;
        }

        return false;
      });
    };
  };
}
