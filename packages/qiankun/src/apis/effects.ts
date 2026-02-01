/**
 * @author Kuitos
 * @since 2019-02-19
 */
import { getMountedApps, navigateToUrl } from 'single-spa';

const firstMountLogLabel = '[qiankun] first app mounted';
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.time(firstMountLogLabel);
}

/**
 * Set default mount app, will navigate to the default app if no app is mounted
 * @param defaultAppLink - The default app route link
 */
export function setDefaultMountApp(defaultAppLink: string): void {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:no-app-change', function listener() {
    const mountedApps = getMountedApps();
    if (!mountedApps.length) {
      navigateToUrl(defaultAppLink);
    }

    window.removeEventListener('single-spa:no-app-change', listener);
  });
}

/**
 * Run a callback function after the first micro app is mounted
 * @param effect - The callback function to run
 */
export function runAfterFirstMounted(effect: () => void): void {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:first-mount', function listener() {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.timeEnd(firstMountLogLabel);
    }

    effect();

    window.removeEventListener('single-spa:first-mount', listener);
  });
}
