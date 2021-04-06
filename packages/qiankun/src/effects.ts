/**
 * @author Kuitos
 * @since 2019-02-19
 */
import { getMountedApps, navigateToUrl } from 'single-spa';

const firstMountLogLabel = '[qiankun] first app mounted';
if (process.env.NODE_ENV === 'development') {
  console.time(firstMountLogLabel);
}

export function setDefaultMountApp(defaultAppLink: string) {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:no-app-change', function listener() {
    const mountedApps = getMountedApps();
    if (!mountedApps.length) {
      navigateToUrl(defaultAppLink);
    }

    window.removeEventListener('single-spa:no-app-change', listener);
  });
}

export function runDefaultMountEffects(defaultAppLink: string) {
  console.warn(
    '[qiankun] runDefaultMountEffects will be removed in next version, please use setDefaultMountApp instead',
  );
  setDefaultMountApp(defaultAppLink);
}

export function runAfterFirstMounted(effect: () => void) {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:first-mount', function listener() {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(firstMountLogLabel);
    }

    effect();

    window.removeEventListener('single-spa:first-mount', listener);
  });
}
