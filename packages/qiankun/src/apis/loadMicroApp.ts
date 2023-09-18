import type { ParcelConfigObject } from 'single-spa';
import { mountRootParcel, patchHistoryApi } from 'single-spa';
import type { ParcelConfigObjectGetter } from '../core/loader';
import loadApp from '../core/loader';
import type { AppConfiguration, LifeCycles, LoadableApp, MicroApp, ObjectType } from '../types';
import { getContainerXPath, toArray } from '../utils';
import { started } from './registerMicroApps';

const appConfigPromiseGetterMap = new Map<string, Promise<ParcelConfigObjectGetter>>();
const containerMicroAppsMap = new Map<string, MicroApp[]>();

export function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
): MicroApp {
  const { props, name, container } = app;

  // Must compute the container xpath at beginning to keep it consist around app running
  // If we compute it every time, the container dom structure most probably been changed and result in a different xpath value
  const containerXPath = getContainerXPath(container);
  const getContainerXPathKey = (xpath: string) => `${name}-${xpath}`;

  let microApp: MicroApp;
  const wrapParcelConfigForRemount = (config: ParcelConfigObject): ParcelConfigObject => {
    let microAppConfig = config;
    if (containerXPath) {
      const appContainerXPathKey = getContainerXPathKey(containerXPath);
      const containerMicroApps = containerMicroAppsMap.get(appContainerXPathKey);
      if (containerMicroApps?.length) {
        const mount = [
          async () => {
            // While there are multiple micro apps mounted on the same container, we must wait until the prev instances all had unmounted
            // Otherwise it will lead some concurrent issues
            const prevLoadMicroApps = containerMicroApps.slice(0, containerMicroApps.indexOf(microApp));
            const prevLoadMicroAppsWhichNotBroken = prevLoadMicroApps.filter(
              (v) => v.getStatus() !== 'LOAD_ERROR' && v.getStatus() !== 'SKIP_BECAUSE_BROKEN',
            );
            await Promise.all(prevLoadMicroAppsWhichNotBroken.map((v) => v.unmountPromise));
          },
          ...toArray(microAppConfig.mount),
        ];

        microAppConfig = {
          ...config,
          mount,
        };
      }
    }

    return {
      ...microAppConfig,
      // empty bootstrap hook which should not run twice while it calling from cached micro app
      bootstrap: () => Promise.resolve(),
    };
  };

  /**
   * using name + container xpath as the micro app instance id,
   * it means if you're rendering a micro app to a dom which have been rendered before,
   * the micro app would not load and evaluate its lifecycles again
   */
  const memorizedLoadingFn = async (): Promise<ParcelConfigObject> => {
    const userConfiguration = configuration;

    if (containerXPath) {
      const appContainerXPathKey = getContainerXPathKey(containerXPath);
      const parcelConfigGetterPromise = appConfigPromiseGetterMap.get(appContainerXPathKey);
      if (parcelConfigGetterPromise) return wrapParcelConfigForRemount((await parcelConfigGetterPromise)(container));
    }

    const parcelConfigObjectGetterPromise = loadApp(app, userConfiguration, lifeCycles);

    if (containerXPath) {
      const appContainerXPathKey = `${name}-${containerXPath}`;
      appConfigPromiseGetterMap.set(appContainerXPathKey, parcelConfigObjectGetterPromise);
    }

    return (await parcelConfigObjectGetterPromise)(container);
  };

  // We need to invoke patchHistoryApi method of single-spa as the popstate event should be dispatched while the main app calling pushState/replaceState automatically,
  // https://github.com/umijs/qiankun/pull/1071
  if (!started) {
    patchHistoryApi();
  }

  microApp = mountRootParcel(memorizedLoadingFn, { domElement: document.createElement('div'), ...props });

  if (containerXPath) {
    const appContainerXPathKey = getContainerXPathKey(containerXPath);
    // Store the microApps which they mounted on the same container
    const microAppsRef = containerMicroAppsMap.get(appContainerXPathKey) || [];
    microAppsRef.push(microApp);
    containerMicroAppsMap.set(appContainerXPathKey, microAppsRef);

    const cleanup = () => {
      const index = microAppsRef.indexOf(microApp);
      microAppsRef.splice(index, 1);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      microApp = null;
    };

    // gc after unmount
    microApp.unmountPromise.then(cleanup).catch(cleanup);
  }

  return microApp;
}
