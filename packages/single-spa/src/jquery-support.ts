import { routingEventsListeningTo } from "./navigation/navigation-events";

let hasInitialized: boolean = false;

export function ensureJQuerySupport(jQuery: any = window.jQuery): void {
  if (!jQuery && window?.$?.fn?.jquery) {
    jQuery = window.$;
  }

  if (jQuery && !hasInitialized) {
    const originalJQueryOn = jQuery.fn.on;
    const originalJQueryOff = jQuery.fn.off;

    jQuery.fn.on = function (eventString, fn) {
      return captureRoutingEvents.call(
        this,
        originalJQueryOn,
        window.addEventListener,
        eventString,
        fn,
        arguments,
      );
    };

    jQuery.fn.off = function (eventString, fn) {
      return captureRoutingEvents.call(
        this,
        originalJQueryOff,
        window.removeEventListener,
        eventString,
        fn,
        arguments,
      );
    };

    hasInitialized = true;
  }
}

function captureRoutingEvents(
  originalJQueryFunction: Function,
  nativeFunctionToCall: Function,
  eventString: string,
  fn: Function,
  originalArgs: any[],
) {
  if (typeof eventString !== "string") {
    return originalJQueryFunction.apply(this, originalArgs);
  }

  const eventNames = eventString.split(/\s+/);
  eventNames.forEach((eventName) => {
    if (routingEventsListeningTo.indexOf(eventName) >= 0) {
      nativeFunctionToCall(eventName, fn);
      eventString = eventString.replace(eventName, "");
    }
  });

  if (eventString.trim() === "") {
    return this;
  } else {
    return originalJQueryFunction.apply(this, originalArgs);
  }
}

declare global {
  interface Window {
    jQuery?: any;
    $?: any;
  }
}
