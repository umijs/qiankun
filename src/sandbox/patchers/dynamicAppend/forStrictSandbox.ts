/**
 * @author Kuitos
 * @since 2020-10-13
 */

import type { Freer } from '../../../interfaces';
import { getCurrentRunningSandboxProxy } from '../../common';
import type { ContainerConfig } from './common';
import {
  isHijackingTag,
  patchHTMLDynamicAppendPrototypeFunctions,
  rawHeadAppendChild,
  rebuildCSSRules,
  recordStyledComponentsCSSRules,
} from './common';

const rawDocumentCreateElement = Document.prototype.createElement;
const rawDOMParserParseFromString = DOMParser.prototype.parseFromString;
export const proxyAttachContainerConfigMap = new WeakMap<WindowProxy, ContainerConfig>();
export const elementAttachContainerConfigMap = new WeakMap<HTMLElement, ContainerConfig>();

function addElementToMap(node: HTMLElement) {
  if (isHijackingTag(node.tagName)) {
    const currentRunningSandboxProxy = getCurrentRunningSandboxProxy();
    if (currentRunningSandboxProxy) {
      const proxyContainerConfig = proxyAttachContainerConfigMap.get(currentRunningSandboxProxy);
      if (proxyContainerConfig) {
        elementAttachContainerConfigMap.set(node, proxyContainerConfig);
      }
    }
  }

  if (node.children?.length) {
    for (let i = 0; i < node.children.length; i++) {
      addElementToMap(node.children[i] as HTMLElement);
    }
  }
}

export function patchDocumentCreateElement() {
  if (Document.prototype.createElement === rawDocumentCreateElement) {
    Document.prototype.createElement = function createElement<K extends keyof HTMLElementTagNameMap>(
      this: Document,
      tagName: K,
      options?: ElementCreationOptions,
    ): HTMLElement {
      const element = rawDocumentCreateElement.call(this, tagName, options);

      const rawInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
      Object.defineProperty(element, 'innerHTML', {
        ...rawInnerHTMLDescriptor,
        set(value) {
          rawInnerHTMLDescriptor!.set!.call(this, value);
          for (let i = 0; i < this.children.length; i++) {
            addElementToMap(this.children[i] as HTMLElement);
          }
        },
      });

      addElementToMap(element);

      return element;
    };
  }

  return function unpatch() {
    Document.prototype.createElement = rawDocumentCreateElement;
  };
}

export function patchDOMParserParseFromString() {
  if (DOMParser.prototype.parseFromString === rawDOMParserParseFromString) {
    DOMParser.prototype.parseFromString = function parseFromString(
      string: string,
      type: DOMParserSupportedType,
    ): Document {
      const resDocument = rawDOMParserParseFromString.call(this, string, type);

      if (type === 'text/html') {
        addElementToMap((resDocument as unknown) as HTMLElement);
      }

      return resDocument;
    };
  }

  return function unpatch() {
    DOMParser.prototype.parseFromString = rawDOMParserParseFromString;
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
  const unpatchDOMParserParseFromString = patchDOMParserParseFromString();

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
      unpatchDOMParserParseFromString();
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
