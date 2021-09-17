/**
 * @author Kuitos
 * @since 2020-10-13
 */

import type { Freer } from '../../../interfaces';
import { getCurrentRunningApp } from '../../common';
import type { ContainerConfig } from './common';
import {
  isHijackingTag,
  patchHTMLDynamicAppendPrototypeFunctions,
  rawHeadAppendChild,
  rebuildCSSRules,
  recordStyledComponentsCSSRules,
} from './common';

declare global {
  interface Window {
    __proxyAttachContainerConfigMap__: WeakMap<WindowProxy, ContainerConfig>;
  }
}

// Get native global window with a sandbox disgusted way, thus we could share it between qiankun instances🤪
// eslint-disable-next-line no-new-func
const nativeGlobal: Window = new Function('return this')();
Object.defineProperty(nativeGlobal, '__proxyAttachContainerConfigMap__', { enumerable: false, writable: true });

// Share proxyAttachContainerConfigMap between multiple qiankun instance, thus they could access the same record
nativeGlobal.__proxyAttachContainerConfigMap__ =
  nativeGlobal.__proxyAttachContainerConfigMap__ || new WeakMap<WindowProxy, ContainerConfig>();
const proxyAttachContainerConfigMap = nativeGlobal.__proxyAttachContainerConfigMap__;

const elementAttachContainerConfigMap = new WeakMap<HTMLElement, ContainerConfig>();

const docCreatePatchedMap = new WeakMap<typeof document.createElement, typeof document.createElement>();
function patchDocumentCreateElement() {
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
          const proxyContainerConfig = proxyAttachContainerConfigMap.get(currentRunningSandboxProxy);
          if (proxyContainerConfig) {
            elementAttachContainerConfigMap.set(element, proxyContainerConfig);
          }
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

let bootstrappingPatchCount = 0;
let mountingPatchCount = 0;

export function patchStrictSandbox(
  appName: string,
  appWrapperGetter: () => HTMLElement | ShadowRoot,
  proxy: Window,
  mounting = true,
  scopedCSS = false,
  excludeAssetFilter?: CallableFunction,
): Freer {
  let containerConfig = proxyAttachContainerConfigMap.get(proxy);
  if (!containerConfig) {
    containerConfig = {
      appName,
      proxy,
      appWrapperGetter,
      dynamicStyleSheetElements: [],
      strictGlobal: true,
      excludeAssetFilter,
      scopedCSS,
    };
    proxyAttachContainerConfigMap.set(proxy, containerConfig);
  }
  // all dynamic style sheets are stored in proxy container
  const { dynamicStyleSheetElements } = containerConfig;

  const unpatchDocumentCreate = patchDocumentCreateElement();

  const unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(
    (element) => elementAttachContainerConfigMap.has(element),
    (element) => elementAttachContainerConfigMap.get(element)!,
  );

  if (!mounting) bootstrappingPatchCount++;
  if (mounting) mountingPatchCount++;

  return function free() {
    // bootstrap patch just called once but its freer will be called multiple times
    if (!mounting && bootstrappingPatchCount !== 0) bootstrappingPatchCount--;
    if (mounting) mountingPatchCount--;

    const allMicroAppUnmounted = mountingPatchCount === 0 && bootstrappingPatchCount === 0;
    // release the overwrite prototype after all the micro apps unmounted
    if (allMicroAppUnmounted) {
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
          rawHeadAppendChild.call(appWrapper, stylesheetElement);
          return true;
        }

        return false;
      });
    };
  };
}
