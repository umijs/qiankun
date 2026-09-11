import { navigateToUrl } from 'qiankun';

type LinkClickEvent = Pick<
  MouseEvent,
  'button' | 'metaKey' | 'altKey' | 'ctrlKey' | 'shiftKey' | 'defaultPrevented' | 'preventDefault'
>;

const locationEvents = ['popstate', 'hashchange', 'single-spa:routing-event'] as const;

function resolveLinkUrl(to: string, base?: string): URL | undefined {
  try {
    return new URL(to, base);
  } catch {
    return undefined;
  }
}

function replaceUrl(url: string): void {
  const state: unknown = window.history.state;
  const notification = { received: false };
  // single-spa delays function listeners until mounting finishes. An event-listener object
  // observes its synchronous history notification, so we do not send a second popstate.
  const listener = {
    handleEvent() {
      notification.received = true;
    },
  };
  window.addEventListener('popstate', listener);
  try {
    window.history.replaceState(state, '', url);
  } finally {
    window.removeEventListener('popstate', listener);
  }
  if (!notification.received) {
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
  }
}

/** Keep active classes current for browser navigation and single-spa reroutes. */
export function subscribeToMicroAppLinkLocation(listener: () => void): () => void {
  locationEvents.forEach((event) => window.addEventListener(event, listener));
  return () => {
    locationEvents.forEach((event) => window.removeEventListener(event, listener));
  };
}

export function isMicroAppLinkActive(
  to: string,
  locationHref = typeof window === 'undefined' ? undefined : window.location.href,
): boolean {
  if (!locationHref) return false;

  const current = resolveLinkUrl(locationHref);
  const destination = resolveLinkUrl(to, typeof document === 'undefined' ? locationHref : document.baseURI);
  const route = (url: URL) => `${url.pathname}${url.search}${url.hash}`;
  return (
    !!current && !!destination && destination.origin === current.origin && route(current).startsWith(route(destination))
  );
}

/** Preserve native anchor behavior unless this is a same-window, same-origin navigation. */
export function navigateMicroAppLink(event: LinkClickEvent, anchor: HTMLAnchorElement, replace = false): void {
  const target =
    anchor.getAttribute('target') ?? anchor.ownerDocument.querySelector('base[target]')?.getAttribute('target');
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey ||
    (target && target.toLowerCase() !== '_self') ||
    anchor.hasAttribute('download')
  ) {
    return;
  }

  const destination = resolveLinkUrl(anchor.href);
  if (
    !destination ||
    !['http:', 'https:'].includes(destination.protocol) ||
    destination.origin !== window.location.origin
  ) {
    return;
  }

  event.preventDefault();
  if (replace) {
    replaceUrl(anchor.href);
  } else {
    navigateToUrl(anchor.href);
  }
}
