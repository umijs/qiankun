import { useSyncExternalStore } from 'react';

/**
 * The shell owns its routing now: micro apps are mounted by `<MicroApp />` off React state, so
 * navigation must not lean on single-spa patching history — qiankun starts single-spa lazily
 * with the first micro app, and until then a pushState emits no popstate at all. We therefore
 * announce our own navigations, and still listen for single-spa reroutes so a micro app
 * navigating the host stays in sync.
 */
const NAVIGATION_EVENT = 'shell:navigation';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(NAVIGATION_EVENT, callback);
  window.addEventListener('single-spa:routing-event', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(NAVIGATION_EVENT, callback);
    window.removeEventListener('single-spa:routing-event', callback);
  };
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, () => window.location.pathname);
}

export function navigate(path: string): void {
  if (window.location.pathname === path) return;

  window.history.pushState(null, '', path);
  window.dispatchEvent(new Event(NAVIGATION_EVENT));
}
