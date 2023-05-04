/**
 * @author Kuitos
 * @since 2020-10-13
 */

import { nativeDocument, nativeGlobal } from '../../consts';
import type { Sandbox } from '../../core/sandbox/types';
import { isBoundedFunction, isCallable } from '../../utils';
import type { Free } from '../types';
import {
  calcAppCount,
  getContainerHeadElement,
  isAllAppsUnmounted,
  patchHTMLDynamicAppendPrototypeFunctions,
  rebuildCSSRules,
  recordStyledComponentsCSSRules,
  styleElementTargetSymbol,
} from './common';
import type { SandboxConfig } from './types';

const elementAttachedSymbol = Symbol('attachedApp');
declare global {
  interface HTMLElement {
    [elementAttachedSymbol]: string;
  }

  interface Window {
    __sandboxConfigWeakMap__: WeakMap<Sandbox, SandboxConfig>;
    __currentLockingSandbox__: Sandbox;
  }
}

// Get native global window with a sandbox disgusted way, thus we could share it between qiankun instances🤪
Object.defineProperty(nativeGlobal, '__sandboxConfigWeakMap__', { enumerable: false, writable: true });

Object.defineProperty(nativeGlobal, '__currentLockingSandbox__', {
  enumerable: false,
  writable: true,
  configurable: true,
});

const rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;

// Share sandboxConfigWeakMap between multiple qiankun instance, thus they could access the same record
nativeGlobal.__sandboxConfigWeakMap__ = nativeGlobal.__sandboxConfigWeakMap__ || new WeakMap<Sandbox, SandboxConfig>();
const sandboxConfigWeakMap = nativeGlobal.__sandboxConfigWeakMap__;

const elementAttachSandboxConfigMap = new WeakMap<HTMLElement, SandboxConfig>();
const mutationObserverPatchedMap = new WeakMap<
  typeof MutationObserver.prototype.observe,
  typeof MutationObserver.prototype.observe
>();
const parentNodePatchedMap = new WeakMap<PropertyDescriptor, PropertyDescriptor>();

function patchDocument(sandbox: Sandbox) {
  const attachElementToSandbox = (element: HTMLElement) => {
    const sandboxConfig = sandboxConfigWeakMap.get(sandbox);
    if (sandboxConfig) {
      elementAttachSandboxConfigMap.set(element, sandboxConfig);
    }
  };

  const proxyDocument = new Proxy(document, {
    set: (target, p, value) => {
      (<any>target)[p] = value;
      return true;
    },
    get: (target, p, receiver) => {
      if (p === 'createElement') {
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
            // @ts-ignore
            delete nativeGlobal.__currentLockingSandbox__;
          }

          return element;
        };
      }

      const value = (<any>target)[p];
      // must rebind the function to the target otherwise it will cause illegal invocation error
      if (isCallable(value) && !isBoundedFunction(value)) {
        return function proxyFunction(...args: unknown[]) {
          return value.call(target, ...args.map((arg) => (arg === receiver ? target : arg)));
        };
      }

      return value;
    },
  });

  sandbox.patchDocument(proxyDocument);

  // patch MutationObserver.prototype.observe to avoid type error
  // https://github.com/umijs/qiankun/issues/2406
  const nativeMutationObserverObserveFn = MutationObserver.prototype.observe;
  if (!mutationObserverPatchedMap.has(nativeMutationObserverObserveFn)) {
    function observe(this: MutationObserver, target: Node, options: MutationObserverInit) {
      const realTarget = target instanceof Document ? nativeDocument : target;
      return nativeMutationObserverObserveFn.call(this, realTarget, options);
    }

    MutationObserver.prototype.observe = observe;
    mutationObserverPatchedMap.set(nativeMutationObserverObserveFn, observe);
  }

  // patch parentNode getter to avoid document === html.parentNode
  // https://github.com/umijs/qiankun/issues/2408#issuecomment-1446229105
  const parentNodeDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode');
  if (parentNodeDescriptor && !parentNodePatchedMap.has(parentNodeDescriptor)) {
    const { get: parentNodeGetter, configurable } = parentNodeDescriptor;
    if (parentNodeGetter && configurable) {
      const patchedParentNodeDescriptor = {
        ...parentNodeDescriptor,
        get(this: Node) {
          const parentNode = parentNodeGetter.call(this);
          if (parentNode instanceof Document) {
            const proxy = getCurrentRunningApp()?.window;
            if (proxy) {
              return proxy.document;
            }
          }

          return parentNode;
        },
      };
      Object.defineProperty(Node.prototype, 'parentNode', patchedParentNodeDescriptor);

      parentNodePatchedMap.set(parentNodeDescriptor, patchedParentNodeDescriptor);
    }
  }

  return () => {
    MutationObserver.prototype.observe = nativeMutationObserverObserveFn;
    mutationObserverPatchedMap.delete(nativeMutationObserverObserveFn);

    if (parentNodeDescriptor) {
      Object.defineProperty(Node.prototype, 'parentNode', parentNodeDescriptor);
      parentNodePatchedMap.delete(parentNodeDescriptor);
    }
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

    recordStyledComponentsCSSRules(dynamicStyleSheetElements);

    // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmounting

    return function rebuild() {
      rebuildCSSRules(dynamicStyleSheetElements, (stylesheetElement) => {
        const appWrapper = getContainer();
        if (!appWrapper.contains(stylesheetElement)) {
          const mountDom =
            stylesheetElement[styleElementTargetSymbol] === 'head' ? getContainerHeadElement(appWrapper) : appWrapper;
          rawHeadAppendChild.call(mountDom, stylesheetElement);
          return true;
        }

        return false;
      });
    };
  };
}
