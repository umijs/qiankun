import { pathToFileURL } from 'node:url';
import { resolve, normalize } from 'pathe';
import { importModule, resolveModule } from 'local-pkg';
import { Console } from 'node:console';

const denyList = /* @__PURE__ */ new Set([
  "GLOBAL",
  "root",
  "global",
  "Buffer",
  "ArrayBuffer",
  "Uint8Array"
]);
const nodeGlobals = new Map(
  Object.getOwnPropertyNames(globalThis).filter((global) => !denyList.has(global)).map((nodeGlobalsKey) => {
    const descriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      nodeGlobalsKey
    );
    if (!descriptor) {
      throw new Error(
        `No property descriptor for ${nodeGlobalsKey}, this is a bug in Vitest.`
      );
    }
    return [nodeGlobalsKey, descriptor];
  })
);
var node = {
  name: "node",
  transformMode: "ssr",
  // this is largely copied from jest's node environment
  async setupVM() {
    const vm = await import('node:vm');
    const context = vm.createContext();
    const global = vm.runInContext(
      "this",
      context
    );
    const contextGlobals = new Set(Object.getOwnPropertyNames(global));
    for (const [nodeGlobalsKey, descriptor] of nodeGlobals) {
      if (!contextGlobals.has(nodeGlobalsKey)) {
        if (descriptor.configurable) {
          Object.defineProperty(global, nodeGlobalsKey, {
            configurable: true,
            enumerable: descriptor.enumerable,
            get() {
              const val = globalThis[nodeGlobalsKey];
              Object.defineProperty(global, nodeGlobalsKey, {
                configurable: true,
                enumerable: descriptor.enumerable,
                value: val,
                writable: descriptor.writable === true || nodeGlobalsKey === "performance"
              });
              return val;
            },
            set(val) {
              Object.defineProperty(global, nodeGlobalsKey, {
                configurable: true,
                enumerable: descriptor.enumerable,
                value: val,
                writable: true
              });
            }
          });
        } else if ("value" in descriptor) {
          Object.defineProperty(global, nodeGlobalsKey, {
            configurable: false,
            enumerable: descriptor.enumerable,
            value: descriptor.value,
            writable: descriptor.writable
          });
        } else {
          Object.defineProperty(global, nodeGlobalsKey, {
            configurable: false,
            enumerable: descriptor.enumerable,
            get: descriptor.get,
            set: descriptor.set
          });
        }
      }
    }
    global.global = global;
    global.Buffer = Buffer;
    global.ArrayBuffer = ArrayBuffer;
    global.Uint8Array = Uint8Array;
    return {
      getVmContext() {
        return context;
      },
      teardown() {
      }
    };
  },
  async setup(global) {
    global.console.Console = Console;
    return {
      teardown(global2) {
        delete global2.console.Console;
      }
    };
  }
};

const LIVING_KEYS = [
  "DOMException",
  "URL",
  "URLSearchParams",
  "EventTarget",
  "NamedNodeMap",
  "Node",
  "Attr",
  "Element",
  "DocumentFragment",
  "DOMImplementation",
  "Document",
  "XMLDocument",
  "CharacterData",
  "Text",
  "CDATASection",
  "ProcessingInstruction",
  "Comment",
  "DocumentType",
  "NodeList",
  "RadioNodeList",
  "HTMLCollection",
  "HTMLOptionsCollection",
  "DOMStringMap",
  "DOMTokenList",
  "StyleSheetList",
  "HTMLElement",
  "HTMLHeadElement",
  "HTMLTitleElement",
  "HTMLBaseElement",
  "HTMLLinkElement",
  "HTMLMetaElement",
  "HTMLStyleElement",
  "HTMLBodyElement",
  "HTMLHeadingElement",
  "HTMLParagraphElement",
  "HTMLHRElement",
  "HTMLPreElement",
  "HTMLUListElement",
  "HTMLOListElement",
  "HTMLLIElement",
  "HTMLMenuElement",
  "HTMLDListElement",
  "HTMLDivElement",
  "HTMLAnchorElement",
  "HTMLAreaElement",
  "HTMLBRElement",
  "HTMLButtonElement",
  "HTMLCanvasElement",
  "HTMLDataElement",
  "HTMLDataListElement",
  "HTMLDetailsElement",
  "HTMLDialogElement",
  "HTMLDirectoryElement",
  "HTMLFieldSetElement",
  "HTMLFontElement",
  "HTMLFormElement",
  "HTMLHtmlElement",
  "HTMLImageElement",
  "HTMLInputElement",
  "HTMLLabelElement",
  "HTMLLegendElement",
  "HTMLMapElement",
  "HTMLMarqueeElement",
  "HTMLMediaElement",
  "HTMLMeterElement",
  "HTMLModElement",
  "HTMLOptGroupElement",
  "HTMLOptionElement",
  "HTMLOutputElement",
  "HTMLPictureElement",
  "HTMLProgressElement",
  "HTMLQuoteElement",
  "HTMLScriptElement",
  "HTMLSelectElement",
  "HTMLSlotElement",
  "HTMLSourceElement",
  "HTMLSpanElement",
  "HTMLTableCaptionElement",
  "HTMLTableCellElement",
  "HTMLTableColElement",
  "HTMLTableElement",
  "HTMLTimeElement",
  "HTMLTableRowElement",
  "HTMLTableSectionElement",
  "HTMLTemplateElement",
  "HTMLTextAreaElement",
  "HTMLUnknownElement",
  "HTMLFrameElement",
  "HTMLFrameSetElement",
  "HTMLIFrameElement",
  "HTMLEmbedElement",
  "HTMLObjectElement",
  "HTMLParamElement",
  "HTMLVideoElement",
  "HTMLAudioElement",
  "HTMLTrackElement",
  "HTMLFormControlsCollection",
  "SVGElement",
  "SVGGraphicsElement",
  "SVGSVGElement",
  "SVGTitleElement",
  "SVGAnimatedString",
  "SVGNumber",
  "SVGStringList",
  "Event",
  "CloseEvent",
  "CustomEvent",
  "MessageEvent",
  "ErrorEvent",
  "HashChangeEvent",
  "PopStateEvent",
  "StorageEvent",
  "ProgressEvent",
  "PageTransitionEvent",
  "SubmitEvent",
  "UIEvent",
  "FocusEvent",
  "InputEvent",
  "MouseEvent",
  "KeyboardEvent",
  "TouchEvent",
  "CompositionEvent",
  "WheelEvent",
  "BarProp",
  "External",
  "Location",
  "History",
  "Screen",
  "Crypto",
  "Performance",
  "Navigator",
  "PluginArray",
  "MimeTypeArray",
  "Plugin",
  "MimeType",
  "FileReader",
  "Blob",
  "File",
  "FileList",
  "ValidityState",
  "DOMParser",
  "XMLSerializer",
  "FormData",
  "XMLHttpRequestEventTarget",
  "XMLHttpRequestUpload",
  "XMLHttpRequest",
  "WebSocket",
  "NodeFilter",
  "NodeIterator",
  "TreeWalker",
  "AbstractRange",
  "Range",
  "StaticRange",
  "Selection",
  "Storage",
  "CustomElementRegistry",
  "ShadowRoot",
  "MutationObserver",
  "MutationRecord",
  "Headers",
  "AbortController",
  "AbortSignal",
  "ArrayBuffer",
  "DOMRectReadOnly",
  "DOMRect",
  // not specified in docs, but is available
  "Image",
  "Audio",
  "Option"
];
const OTHER_KEYS = [
  "addEventListener",
  "alert",
  "atob",
  "blur",
  "btoa",
  "cancelAnimationFrame",
  /* 'clearInterval', */
  /* 'clearTimeout', */
  "close",
  "confirm",
  /* 'console', */
  "createPopup",
  "dispatchEvent",
  "document",
  "focus",
  "frames",
  "getComputedStyle",
  "history",
  "innerHeight",
  "innerWidth",
  "length",
  "location",
  "matchMedia",
  "moveBy",
  "moveTo",
  "name",
  "navigator",
  "open",
  "outerHeight",
  "outerWidth",
  "pageXOffset",
  "pageYOffset",
  "parent",
  "postMessage",
  "print",
  "prompt",
  "removeEventListener",
  "requestAnimationFrame",
  "resizeBy",
  "resizeTo",
  "screen",
  "screenLeft",
  "screenTop",
  "screenX",
  "screenY",
  "scroll",
  "scrollBy",
  "scrollLeft",
  "scrollTo",
  "scrollTop",
  "scrollX",
  "scrollY",
  "self",
  /* 'setInterval', */
  /* 'setTimeout', */
  "stop",
  /* 'toString', */
  "top",
  "Window",
  "window"
];
const KEYS = LIVING_KEYS.concat(OTHER_KEYS);

const skipKeys = [
  "window",
  "self",
  "top",
  "parent",
  "URL"
];
function getWindowKeys(global, win) {
  const keys = new Set(KEYS.concat(Object.getOwnPropertyNames(win)).filter((k) => {
    if (skipKeys.includes(k))
      return false;
    if (k in global)
      return KEYS.includes(k);
    return true;
  }));
  return keys;
}
function isClassLikeName(name) {
  return name[0] === name[0].toUpperCase();
}
function populateGlobal(global, win, options = {}) {
  const { bindFunctions = false } = options;
  const keys = getWindowKeys(global, win);
  const originals = /* @__PURE__ */ new Map();
  const overrideObject = /* @__PURE__ */ new Map();
  for (const key of keys) {
    const boundFunction = bindFunctions && typeof win[key] === "function" && !isClassLikeName(key) && win[key].bind(win);
    if (KEYS.includes(key) && key in global)
      originals.set(key, global[key]);
    Object.defineProperty(global, key, {
      get() {
        if (overrideObject.has(key))
          return overrideObject.get(key);
        if (boundFunction)
          return boundFunction;
        return win[key];
      },
      set(v) {
        overrideObject.set(key, v);
      },
      configurable: true
    });
  }
  global.window = global;
  global.self = global;
  global.top = global;
  global.parent = global;
  if (global.global)
    global.global = global;
  if (global.document && global.document.defaultView) {
    Object.defineProperty(global.document, "defaultView", {
      get: () => global,
      enumerable: true,
      configurable: true
    });
  }
  skipKeys.forEach((k) => keys.add(k));
  return {
    keys,
    skipKeys,
    originals
  };
}

function catchWindowErrors(window) {
  let userErrorListenerCount = 0;
  function throwUnhandlerError(e) {
    if (userErrorListenerCount === 0 && e.error != null)
      process.emit("uncaughtException", e.error);
  }
  const addEventListener = window.addEventListener.bind(window);
  const removeEventListener = window.removeEventListener.bind(window);
  window.addEventListener("error", throwUnhandlerError);
  window.addEventListener = function(...args) {
    if (args[0] === "error")
      userErrorListenerCount++;
    return addEventListener.apply(this, args);
  };
  window.removeEventListener = function(...args) {
    if (args[0] === "error" && userErrorListenerCount)
      userErrorListenerCount--;
    return removeEventListener.apply(this, args);
  };
  return function clearErrorHandlers() {
    window.removeEventListener("error", throwUnhandlerError);
  };
}
var jsdom = {
  name: "jsdom",
  transformMode: "web",
  async setupVM({ jsdom = {} }) {
    const {
      CookieJar,
      JSDOM,
      ResourceLoader,
      VirtualConsole
    } = await importModule("jsdom");
    const {
      html = "<!DOCTYPE html>",
      userAgent,
      url = "http://localhost:3000",
      contentType = "text/html",
      pretendToBeVisual = true,
      includeNodeLocations = false,
      runScripts = "dangerously",
      resources,
      console = false,
      cookieJar = false,
      ...restOptions
    } = jsdom;
    const dom = new JSDOM(
      html,
      {
        pretendToBeVisual,
        resources: resources ?? (userAgent ? new ResourceLoader({ userAgent }) : void 0),
        runScripts,
        url,
        virtualConsole: console && globalThis.console ? new VirtualConsole().sendTo(globalThis.console) : void 0,
        cookieJar: cookieJar ? new CookieJar() : void 0,
        includeNodeLocations,
        contentType,
        userAgent,
        ...restOptions
      }
    );
    const clearWindowErrors = catchWindowErrors(dom.window);
    dom.window.Buffer = Buffer;
    dom.window.Uint8Array = Uint8Array;
    if (typeof structuredClone !== "undefined" && !dom.window.structuredClone)
      dom.window.structuredClone = structuredClone;
    return {
      getVmContext() {
        return dom.getInternalVMContext();
      },
      teardown() {
        clearWindowErrors();
        dom.window.close();
      }
    };
  },
  async setup(global, { jsdom = {} }) {
    const {
      CookieJar,
      JSDOM,
      ResourceLoader,
      VirtualConsole
    } = await importModule("jsdom");
    const {
      html = "<!DOCTYPE html>",
      userAgent,
      url = "http://localhost:3000",
      contentType = "text/html",
      pretendToBeVisual = true,
      includeNodeLocations = false,
      runScripts = "dangerously",
      resources,
      console = false,
      cookieJar = false,
      ...restOptions
    } = jsdom;
    const dom = new JSDOM(
      html,
      {
        pretendToBeVisual,
        resources: resources ?? (userAgent ? new ResourceLoader({ userAgent }) : void 0),
        runScripts,
        url,
        virtualConsole: console && global.console ? new VirtualConsole().sendTo(global.console) : void 0,
        cookieJar: cookieJar ? new CookieJar() : void 0,
        includeNodeLocations,
        contentType,
        userAgent,
        ...restOptions
      }
    );
    const { keys, originals } = populateGlobal(global, dom.window, { bindFunctions: true });
    const clearWindowErrors = catchWindowErrors(global);
    return {
      teardown(global2) {
        clearWindowErrors();
        dom.window.close();
        keys.forEach((key) => delete global2[key]);
        originals.forEach((v, k) => global2[k] = v);
      }
    };
  }
};

var happy = {
  name: "happy-dom",
  transformMode: "web",
  async setupVM() {
    const { Window } = await importModule("happy-dom");
    const win = new Window();
    win.Buffer = Buffer;
    win.Uint8Array = Uint8Array;
    if (typeof structuredClone !== "undefined" && !win.structuredClone)
      win.structuredClone = structuredClone;
    return {
      getVmContext() {
        return win;
      },
      teardown() {
        win.happyDOM.cancelAsync();
      }
    };
  },
  async setup(global) {
    const { Window, GlobalWindow } = await importModule("happy-dom");
    const win = new (GlobalWindow || Window)();
    const { keys, originals } = populateGlobal(global, win, { bindFunctions: true });
    return {
      teardown(global2) {
        win.happyDOM.cancelAsync();
        keys.forEach((key) => delete global2[key]);
        originals.forEach((v, k) => global2[k] = v);
      }
    };
  }
};

var edge = {
  name: "edge-runtime",
  transformMode: "ssr",
  async setupVM() {
    const { EdgeVM } = await importModule("@edge-runtime/vm");
    const vm = new EdgeVM({
      extend: (context) => {
        context.global = context;
        context.Buffer = Buffer;
        return context;
      }
    });
    return {
      getVmContext() {
        return vm.context;
      },
      teardown() {
      }
    };
  },
  async setup(global) {
    const { EdgeVM } = await importModule("@edge-runtime/vm");
    const vm = new EdgeVM({
      extend: (context) => {
        context.global = context;
        context.Buffer = Buffer;
        return context;
      }
    });
    const { keys, originals } = populateGlobal(global, vm.context, { bindFunctions: true });
    return {
      teardown(global2) {
        keys.forEach((key) => delete global2[key]);
        originals.forEach((v, k) => global2[k] = v);
      }
    };
  }
};

const environments = {
  node,
  jsdom,
  "happy-dom": happy,
  "edge-runtime": edge
};
const envPackageNames = {
  "jsdom": "jsdom",
  "happy-dom": "happy-dom",
  "edge-runtime": "@edge-runtime/vm"
};
function isBuiltinEnvironment(env) {
  return env in environments;
}
function getEnvPackageName(env) {
  if (env === "node")
    return null;
  if (env in envPackageNames)
    return envPackageNames[env];
  return `vitest-environment-${env}`;
}
async function loadEnvironment(name, root) {
  if (isBuiltinEnvironment(name))
    return environments[name];
  const packageId = name[0] === "." || name[0] === "/" ? resolve(root, name) : resolveModule(`vitest-environment-${name}`, { paths: [root] }) ?? resolve(root, name);
  const pkg = await import(pathToFileURL(normalize(packageId)).href);
  if (!pkg || !pkg.default || typeof pkg.default !== "object") {
    throw new TypeError(
      `Environment "${name}" is not a valid environment. Path "${packageId}" should export default object with a "setup" or/and "setupVM" method.`
    );
  }
  const environment = pkg.default;
  if (environment.transformMode !== "web" && environment.transformMode !== "ssr") {
    throw new TypeError(
      `Environment "${name}" is not a valid environment. Path "${packageId}" should export default object with a "transformMode" method equal to "ssr" or "web".`
    );
  }
  return environment;
}

export { environments as e, getEnvPackageName as g, loadEnvironment as l, populateGlobal as p };
