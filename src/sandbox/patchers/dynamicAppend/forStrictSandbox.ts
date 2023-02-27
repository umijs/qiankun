/**
 * @author Kuitos
 * @since 2020-10-13
 */

import type { Freer, SandBox } from '../../../interfaces';
import { isBoundedFunction, nativeDocument, nativeGlobal } from '../../../utils';
import { getCurrentRunningApp } from '../../common';
import type { ContainerConfig } from './common';
import {
  calcAppCount,
  getAppWrapperHeadElement,
  isAllAppsUnmounted,
  isHijackingTag,
  patchHTMLDynamicAppendPrototypeFunctions,
  rawHeadAppendChild,
  rebuildCSSRules,
  recordStyledComponentsCSSRules,
  styleElementTargetSymbol,
} from './common';

// Get native global window with a sandbox disgusted way, thus we could share it between qiankun instances🤪
Object.defineProperty(nativeGlobal, '__proxyAttachContainerConfigMap__', { enumerable: false, writable: true });

// Share proxyAttachContainerConfigMap between multiple qiankun instance, thus they could access the same record
nativeGlobal.__proxyAttachContainerConfigMap__ =
  nativeGlobal.__proxyAttachContainerConfigMap__ || new WeakMap<WindowProxy, ContainerConfig>();
const proxyAttachContainerConfigMap: WeakMap<WindowProxy, ContainerConfig> =
  nativeGlobal.__proxyAttachContainerConfigMap__;

const elementAttachContainerConfigMap = new WeakMap<HTMLElement, ContainerConfig>();

const docCreatePatchedMap = new WeakMap<typeof document.createElement, typeof document.createElement>();

function patchDocument(cfg: { sandbox: SandBox; speedy: boolean }) {
  const { sandbox, speedy } = cfg;

  const attachElementToProxy = (element: HTMLElement, proxy: Window) => {
    const proxyContainerConfig = proxyAttachContainerConfigMap.get(proxy);
    if (proxyContainerConfig) {
      elementAttachContainerConfigMap.set(element, proxyContainerConfig);
    }
  };

  if (speedy) {
    const proxyDocument = new Proxy(document, {
      set: (target, p, value) => {
        (<any>target)[p] = value;
        return true;
      },
      get: (target, p) => {
        if (p === 'createElement') {
          // Must store the original createElement function to avoid error in nested sandbox
          const targetCreateElement = target.createElement;
          return function createElement(...args: Parameters<typeof document.createElement>) {
            const element = targetCreateElement.call(target, ...args);
            attachElementToProxy(element, sandbox.proxy);
            return element;
          };
        }

        const value = (<any>target)[p];
        // must rebind the function to the target otherwise it will cause illegal invocation error
        if (typeof value === 'function' && !isBoundedFunction(value)) {
          return value.bind(target);
        }

        return value;
      },
    });

    sandbox.patchDocument(proxyDocument);

    // patch MutationObserver.prototype.observe to avoid type error
    // https://github.com/umijs/qiankun/issues/2406
    const nativeMutationObserverObserveFn = MutationObserver.prototype.observe;
    MutationObserver.prototype.observe = function observe(
      this: MutationObserver,
      target: Node,
      options: MutationObserverInit,
    ) {
      const realTarget = target instanceof Document ? nativeDocument : target;
      return nativeMutationObserverObserveFn.call(this, realTarget, options);
    };

    return () => {
      MutationObserver.prototype.observe = nativeMutationObserverObserveFn;
    };
  }

  const docCreateElementFnBeforeOverwrite = docCreatePatchedMap.get(document.createElement);
  if (!docCreateElementFnBeforeOverwrite) {
    const rawDocumentCreateElement = document.createElement;
    Document.prototype.createElement = function createElement<K extends keyof HTMLElementTagNameMap>(
      this: Document,
      tagName: K,
      options?: ElementCreationOptions,
    ): HTMLElement {
      const element = rawDocumentCreateElement.call(this, tagName, options);
      if (isHijackingTag(tagName)) {
        const { window: currentRunningSandboxProxy } = getCurrentRunningApp() || {};
        if (currentRunningSandboxProxy) {
          attachElementToProxy(element, currentRunningSandboxProxy);
        }
      }

      return element;
    };

    // It means it have been overwritten while createElement is an own property of document
    if (document.hasOwnProperty('createElement')) {
      document.createElement = Document.prototype.createElement;
    }

    docCreatePatchedMap.set(Document.prototype.createElement, rawDocumentCreateElement);
  }

  return function unpatch() {
    if (docCreateElementFnBeforeOverwrite) {
      Document.prototype.createElement = docCreateElementFnBeforeOverwrite;
      document.createElement = docCreateElementFnBeforeOverwrite;
    }
  };
}

export function patchStrictSandbox(
  appName: string,
  appWrapperGetter: () => HTMLElement | ShadowRoot,
  sandbox: SandBox,
  mounting = true,
  scopedCSS = false,
  excludeAssetFilter?: CallableFunction,
  speedySandbox = false,
): Freer {
  const { proxy } = sandbox;
  let containerConfig = proxyAttachContainerConfigMap.get(proxy);
  if (!containerConfig) {
    containerConfig = {
      appName,
      proxy,
      appWrapperGetter,
      dynamicStyleSheetElements: [],
      strictGlobal: true,
      speedySandbox,
      excludeAssetFilter,
      scopedCSS,
    };
    proxyAttachContainerConfigMap.set(proxy, containerConfig);
  }
  // all dynamic style sheets are stored in proxy container
  const { dynamicStyleSheetElements } = containerConfig;

  const unpatchDocumentCreate = patchDocument({ sandbox, speedy: speedySandbox });

  const unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(
    (element) => elementAttachContainerConfigMap.has(element),
    (element) => elementAttachContainerConfigMap.get(element)!,
  );

  if (!mounting) calcAppCount(appName, 'increase', 'bootstrapping');
  if (mounting) calcAppCount(appName, 'increase', 'mounting');

  return function free() {
    if (!mounting) calcAppCount(appName, 'decrease', 'bootstrapping');
    if (mounting) calcAppCount(appName, 'decrease', 'mounting');

    // release the overwritten prototype after all the micro apps unmounted
    if (isAllAppsUnmounted()) {
      unpatchDynamicAppendPrototypeFunctions();
      unpatchDocumentCreate();
    }

    recordStyledComponentsCSSRules(dynamicStyleSheetElements);

    // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmoutting

    return function rebuild() {
      rebuildCSSRules(dynamicStyleSheetElements, (stylesheetElement) => {
        const appWrapper = appWrapperGetter();
        if (!appWrapper.contains(stylesheetElement)) {
          const mountDom =
            stylesheetElement[styleElementTargetSymbol] === 'head' ? getAppWrapperHeadElement(appWrapper) : appWrapper;
          rawHeadAppendChild.call(mountDom, stylesheetElement);
          return true;
        }

        return false;
      });
    };
  };
}
