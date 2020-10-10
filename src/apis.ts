import { noop } from 'lodash';
import { mountRootParcel, ParcelConfigObject, registerApplication, start as startSingleSpa } from 'single-spa';
import { FrameworkConfiguration, FrameworkLifeCycles, LoadableApp, MicroApp, RegistrableApp } from './interfaces';
import { loadApp } from './loader';
import { doPrefetchStrategy } from './prefetch';
import { Deferred, getXPathForElement, toArray } from './utils';

let microApps: RegistrableApp[] = [];

// eslint-disable-next-line import/no-mutable-exports
export let frameworkConfiguration: FrameworkConfiguration = {};
const frameworkStartedDefer = new Deferred<void>();

export function registerMicroApps<T extends object = {}>(
  apps: Array<RegistrableApp<T>>,
  lifeCycles?: FrameworkLifeCycles<T>,
) {
  // Each app only needs to be registered once
  const unregisteredApps = apps.filter(app => !microApps.some(registeredApp => registeredApp.name === app.name));

  microApps = [...microApps, ...unregisteredApps];

  unregisteredApps.forEach(app => {
    const { name, activeRule, loader = noop, props, ...appConfig } = app;

    registerApplication({
      name,
      app: async () => {
        loader(true);
        await frameworkStartedDefer.promise;

        const { mount, ...otherMicroAppConfigs } = await loadApp(
          { name, props, ...appConfig },
          frameworkConfiguration,
          lifeCycles,
        );

        return {
          mount: [async () => loader(true), ...toArray(mount), async () => loader(false)],
          ...otherMicroAppConfigs,
        };
      },
      activeWhen: activeRule,
      customProps: props,
    });
  });
}

const appConfigMap = new Map<string, Promise<ParcelConfigObject>>();

export function loadMicroApp<T extends object = {}>(
  app: LoadableApp<T>,
  configuration?: FrameworkConfiguration,
  lifeCycles?: FrameworkLifeCycles<T>,
): MicroApp {
  const { props, name } = app;

  const getContainerXpath = (container: string | HTMLElement): string | void => {
    const containerElement = typeof container === 'string' ? document.querySelector(container) : container;
    if (containerElement) {
      return getXPathForElement(containerElement, document);
    }

    return undefined;
  };

  /**
   * using name + container xpath as the micro app instance id,
   * it means if you rendering a micro app to a dom which have been rendered before,
   * the micro app would not load and evaluate its lifecycles again
   */
  const memorizedLoadingFn = async (): Promise<ParcelConfigObject> => {
    const container = 'container' in app ? app.container : undefined;
    if (container) {
      const xpath = getContainerXpath(container);
      if (xpath) {
        const parcelConfig = appConfigMap.get(`${name}-${xpath}`);
        if (parcelConfig) return parcelConfig;
      }
    }

    const parcelConfig = loadApp(app, configuration ?? frameworkConfiguration, lifeCycles);

    if (container) {
      const xpath = getContainerXpath(container);
      if (xpath)
        appConfigMap.set(
          `${name}-${xpath}`,
          // empty bootstrap hook which should not run twice while it calling from cached micro app
          parcelConfig.then(config => ({ ...config, bootstrap: () => Promise.resolve() })),
        );
    }

    return parcelConfig;
  };

  return mountRootParcel(memorizedLoadingFn, { domElement: document.createElement('div'), ...props });
}

export function start(opts: FrameworkConfiguration = {}) {
  frameworkConfiguration = { prefetch: true, singular: true, sandbox: true, ...opts };
  const { prefetch, sandbox, singular, urlRerouteOnly, ...importEntryOpts } = frameworkConfiguration;

  if (prefetch) {
    doPrefetchStrategy(microApps, prefetch, importEntryOpts);
  }

  if (sandbox) {
    if (!window.Proxy) {
      console.warn('[qiankun] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox');
      // 快照沙箱不支持非 singular 模式
      if (!singular) {
        console.error('[qiankun] singular is forced to be true when sandbox enable but proxySandbox unavailable');
        frameworkConfiguration.singular = true;
      }
    }
  }

  startSingleSpa({ urlRerouteOnly });

  frameworkStartedDefer.resolve();
}
