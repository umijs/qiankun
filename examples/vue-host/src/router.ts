import { readonly, ref } from 'vue';

/**
 * The shell owns its routing: micro apps are mounted by `<MicroApp />` off reactive state, so
 * navigation must not lean on single-spa patching history — qiankun starts single-spa lazily with
 * the first micro app, and until then a pushState emits no popstate at all. We therefore announce
 * our own navigations, and still listen for single-spa reroutes so a micro app navigating the host
 * stays in sync.
 */
const NAVIGATION_EVENT = 'shell:navigation';

const pathname = ref(window.location.pathname);

const sync = () => {
  pathname.value = window.location.pathname;
};

// the shell lives for the lifetime of the page, so these listeners are never torn down
window.addEventListener('popstate', sync);
window.addEventListener(NAVIGATION_EVENT, sync);
window.addEventListener('single-spa:routing-event', sync);

export const currentPath = readonly(pathname);

export function navigate(path: string): void {
  if (window.location.pathname === path) return;

  window.history.pushState(null, '', path);
  window.dispatchEvent(new Event(NAVIGATION_EVENT));
}
