import { reroute } from "./reroute";
import { formatErrorMessage } from "../applications/app-errors";
import { isInBrowser } from "../utils/runtime-environment";
import { StartOpts } from "../start";

/* We capture navigation event listeners so that we can make sure
 * that application navigation listeners are not called until
 * single-spa has ensured that the correct applications are
 * unmounted and mounted.
 */
const capturedEventListeners: CapturedEventListeners = {
  hashchange: [],
  popstate: [],
};

interface CapturedEventListeners {
  hashchange: ((this: Window, ev: HashChangeEvent) => any)[];
  popstate: ((this: Window, ev: PopStateEvent) => any)[];
}

export const routingEventsListeningTo = ["hashchange", "popstate"];

type NavigateArg = string | HTMLAnchorElement | MouseEvent;

export function navigateToUrl(obj: NavigateArg): void {
  let url;
  if (typeof obj === "string") {
    url = obj;
  } else if (this && this.href) {
    url = this.href;
  } else if (
    obj &&
    "currentTarget" in obj &&
    "href" in obj.currentTarget &&
    "preventDefault" in obj
  ) {
    url = ((obj as MouseEvent).currentTarget as HTMLAnchorElement).href;
    (obj as MouseEvent).preventDefault();
  } else {
    throw Error(
      formatErrorMessage(
        14,
        __DEV__ &&
          `singleSpaNavigate/navigateToUrl must be either called with a string url, with an <a> tag as its context, or with an event whose currentTarget is an <a> tag`,
      ),
    );
  }

  const current = new URL(window.location.href);
  const destination = new URL(url, window.location.href);

  if (url.indexOf("#") === 0) {
    window.location.hash = destination.hash;
  } else if (current.host !== destination.host && destination.host) {
    if (process.env.BABEL_ENV === "test") {
      // @ts-expect-error test-only return value
      return { wouldHaveReloadedThePage: true };
    } else {
      window.location.href = url;
    }
  } else if (
    destination.pathname === current.pathname &&
    destination.search === current.search
  ) {
    window.location.hash = destination.hash;
  } else {
    // different path, host, or query params
    window.history.pushState(null, null, url);
  }
}

export function callCapturedEventListeners(
  eventArguments: [HashChangeEvent | PopStateEvent],
): void {
  if (eventArguments) {
    const eventType = eventArguments[0].type;
    if (routingEventsListeningTo.indexOf(eventType) >= 0) {
      capturedEventListeners[eventType].forEach((listener) => {
        try {
          // The error thrown by application event listener should not break single-spa down.
          // Just like https://github.com/single-spa/single-spa/blob/85f5042dff960e40936f3a5069d56fc9477fac04/src/navigation/reroute.js#L140-L146 did
          listener.apply(this, eventArguments);
        } catch (e) {
          setTimeout(() => {
            throw e;
          });
        }
      });
    }
  }
}

let urlRerouteOnly: boolean;

function urlReroute(evt: HashChangeEvent | PopStateEvent) {
  reroute([], [evt]);
}

type UpdateState = (data: any, unused: string, url?: string | URL) => void;

function patchedUpdateState(
  updateState: UpdateState,
  methodName: "pushState" | "replaceState",
) {
  return function () {
    const urlBefore = window.location.href;
    const result = updateState.apply(this, arguments);
    const urlAfter = window.location.href;

    if (!urlRerouteOnly || urlBefore !== urlAfter) {
      // fire an artificial popstate event so that
      // single-spa applications know about routing that
      // occurs in a different application
      window.dispatchEvent(
        createPopStateEvent(window.history.state, methodName),
      );
    }

    return result;
  };
}

interface SingleSpaPopStateEvent extends PopStateEvent {
  singleSpa: boolean;
  singleSpaTrigger: string;
}

function createPopStateEvent(
  state,
  originalMethodName,
): SingleSpaPopStateEvent {
  // https://github.com/single-spa/single-spa/issues/224 and https://github.com/single-spa/single-spa-angular/issues/49
  // We need a popstate event even though the browser doesn't fire one by default when you call replaceState, so that
  // all the applications can reroute. We explicitly identify this extraneous event by setting singleSpa=true and
  // singleSpaTrigger=<pushState|replaceState> on the event instance.
  let evt = new PopStateEvent("popstate", { state });
  (evt as SingleSpaPopStateEvent).singleSpa = true;
  (evt as SingleSpaPopStateEvent).singleSpaTrigger = originalMethodName;
  return evt as SingleSpaPopStateEvent;
}

export let originalReplaceState: (
  data: any,
  unused: string,
  url?: string | URL,
) => void = null;

let historyApiIsPatched: boolean = false;

// We patch the history API so single-spa is notified of all calls to pushState/replaceState.
// We patch addEventListener/removeEventListener so we can capture all popstate/hashchange event listeners,
// and delay calling them until single-spa has finished mounting/unmounting applications
export function patchHistoryApi(opts?: StartOpts) {
  if (historyApiIsPatched) {
    throw Error(
      formatErrorMessage(
        43,
        __DEV__ &&
          `single-spa: patchHistoryApi() was called after the history api was already patched.`,
      ),
    );
  }

  // True by default, as a performance optimization that reduces
  // the number of extraneous popstate events
  urlRerouteOnly = opts?.hasOwnProperty("urlRerouteOnly")
    ? opts.urlRerouteOnly
    : true;

  historyApiIsPatched = true;

  originalReplaceState = window.history.replaceState;

  // We will trigger an app change for any routing events.
  window.addEventListener("hashchange", urlReroute);
  window.addEventListener("popstate", urlReroute);

  // Patch addEventListener so that we can ensure correct timing
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  window.addEventListener = function (eventName, fn) {
    if (typeof fn === "function") {
      if (
        routingEventsListeningTo.indexOf(eventName) >= 0 &&
        !capturedEventListeners[eventName].find((listener) => listener === fn)
      ) {
        capturedEventListeners[eventName].push(fn);
        return;
      }
    }

    return originalAddEventListener.apply(this, arguments);
  };

  window.removeEventListener = function (eventName, listenerFn) {
    if (typeof listenerFn === "function") {
      if (routingEventsListeningTo.includes(eventName)) {
        capturedEventListeners[eventName] = capturedEventListeners[
          eventName
        ].filter((fn) => fn !== listenerFn);
      }
    }

    return originalRemoveEventListener.apply(this, arguments);
  };

  window.history.pushState = patchedUpdateState(
    window.history.pushState,
    "pushState",
  );
  window.history.replaceState = patchedUpdateState(
    originalReplaceState,
    "replaceState",
  );
}

// Detect if single-spa has already been loaded on the page.
// If so, warn because this can result in lots of problems, including
// lots of extraneous popstate events and unexpected results for
// apis like getAppNames().
if (isInBrowser) {
  if (window.singleSpaNavigate) {
    console.warn(
      formatErrorMessage(
        41,
        __DEV__ &&
          "single-spa has been loaded twice on the page. This can result in unexpected behavior.",
      ),
    );
  } else {
    /* For convenience in `onclick` attributes, we expose a global function for navigating to
     * whatever an <a> tag's href is.
     */
    window.singleSpaNavigate = navigateToUrl;
  }
}
