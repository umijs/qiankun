import { readonly, ref } from 'vue';

/** Keep the shell in sync with MicroAppLink, browser history, and micro-app navigation. */
const pathname = ref(window.location.pathname);

const sync = () => {
  pathname.value = window.location.pathname;
};

// the shell lives for the lifetime of the page, so these listeners are never torn down
window.addEventListener('popstate', sync);
window.addEventListener('single-spa:routing-event', sync);

export const currentPath = readonly(pathname);
