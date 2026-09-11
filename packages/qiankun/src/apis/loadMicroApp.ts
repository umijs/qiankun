import { AppOrParcelStatus, mountRootParcel, type ParcelConfigObject } from '@qiankunjs/single-spa';
import loadApp, { type ParcelConfigObjectGetter } from '../core/loadApp';
import { type AppConfiguration, type LifeCycles, type LoadableApp, type MicroApp, type ObjectType } from '../types';
import { toArray } from '../utils';
import { start, started } from './registerMicroApps';

const appConfigPromiseGetterMap = new WeakMap<HTMLElement, Map<string, Promise<ParcelConfigObjectGetter>>>();
const containerMicroAppsMap = new WeakMap<HTMLElement, Map<string, MicroApp[]>>();

export function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
): MicroApp {
  const { props, name, container } = app;

  let appConfigPromises = appConfigPromiseGetterMap.get(container);
  if (!appConfigPromises) {
    appConfigPromises = new Map();
    appConfigPromiseGetterMap.set(container, appConfigPromises);
  }

  let containerMicroApps = containerMicroAppsMap.get(container);
  if (!containerMicroApps) {
    containerMicroApps = new Map();
    containerMicroAppsMap.set(container, containerMicroApps);
  }
  const microAppsRef = containerMicroApps.get(name) ?? [];
  containerMicroApps.set(name, microAppsRef);

  // Null after unmount cleanup so the long-lived remount closures release the parcel for GC.
  let microApp: MicroApp | null = null;
  const wrapParcelConfigForRemount = (config: ParcelConfigObject): ParcelConfigObject => ({
    ...config,
    // A cached getter shares its original load hold. While the entry stream is still open,
    // loadApp can adopt that hold for mount, so the container gate alone cannot serialize
    // these same-name parcels. Wait for their predecessors before entering the mount chain.
    mount: [
      async () => {
        const predecessors = microAppsRef.slice(0, microAppsRef.indexOf(microApp as MicroApp));
        await Promise.all(
          predecessors
            .filter(
              (previous) =>
                previous.getStatus() !== AppOrParcelStatus.LOAD_ERROR &&
                previous.getStatus() !== AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
            )
            .map((previous) => previous.unmountPromise),
        );
      },
      ...toArray(config.mount),
    ],
    // A cached micro app has already bootstrapped.
    bootstrap: () => Promise.resolve(),
  });

  // Only the same name and the same element reuse evaluated lifecycles. A new element gets
  // its own sandbox even if it occupies a former container's position in the document.
  const memorizedLoadingFn = async (): Promise<ParcelConfigObject> => {
    const cachedConfigGetter = appConfigPromises.get(name);
    if (cachedConfigGetter) return wrapParcelConfigForRemount((await cachedConfigGetter)(container));

    const configGetterPromise = loadApp(app, configuration, lifeCycles);
    appConfigPromises.set(name, configGetterPromise);
    try {
      const configGetter = await configGetterPromise;
      return configGetter(container);
    } catch (error) {
      appConfigPromises.delete(name);
      throw error;
    }
  };

  if (!started) {
    // We need to invoke start method of single-spa as the popstate event should be dispatched while the main app calling pushState/replaceState automatically,
    // but in single-spa it will check the start status before it dispatch popstate
    // see https://github.com/single-spa/single-spa/blob/f28b5963be1484583a072c8145ac0b5a28d91235/src/navigation/navigation-events.js#L101
    // ref https://github.com/umijs/qiankun/pull/1071
    start();
  }

  const mountedApp = mountRootParcel(memorizedLoadingFn, {
    domElement: document.createElement('div'),
    ...props,
  });
  microApp = mountedApp;
  microAppsRef.push(mountedApp);

  const cleanup = () => {
    const index = microAppsRef.indexOf(mountedApp);
    microAppsRef.splice(index, 1);
    microApp = null;
  };

  mountedApp.unmountPromise.then(cleanup).catch(cleanup);

  return mountedApp;
}
