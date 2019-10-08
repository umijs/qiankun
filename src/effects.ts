/**
 * @author Kuitos
 * @since 2019-02-19
 */
import { getMountedApps, navigateToUrl } from 'single-spa';

const firstMountLogLabel = '[qiankun]: first app mounted';
if (process.env.NODE_ENV === 'development') {
  console.time(firstMountLogLabel);
}

export function setDefaultMountApp(defaultAppLink: string) {
  window.addEventListener(
    'single-spa:no-app-change',
    () => {
      const mountedApps = getMountedApps();
      if (!mountedApps.length) {
        navigateToUrl(defaultAppLink);
      }
    },
    { once: true },
  );
}

export function runDefaultMountEffects(defaultAppLink: string) {
  console.warn(
    'runDefaultMountEffects will be removed in next version, please use setDefaultMountApp instead!',
  );
  setDefaultMountApp(defaultAppLink);
}

export function runAfterFirstMounted(effect: () => void) {
  window.addEventListener(
    'single-spa:first-mount',
    () => {
      if (process.env.NODE_ENV === 'development') {
        console.timeEnd(firstMountLogLabel);
      }

      effect();
    },
    { once: true },
  );
}
