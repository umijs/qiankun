import { registerApplication, start as startSingleSpa } from 'single-spa';
import { Configuration, LifeCycles, RegistrableApp } from './interfaces';
import { loadApp } from './loader';
import { prefetchApps } from './prefetch';
import { Deferred } from './utils';

let microApps: RegistrableApp[] = [];

// eslint-disable-next-line import/no-mutable-exports
export let frameworkConfiguration: Configuration = {};
export const frameworkStartedDefer = new Deferred<void>();

export function registerMicroApps<T extends object = {}>(apps: Array<RegistrableApp<T>>, lifeCycles?: LifeCycles<T>) {
  // Each app only needs to be registered once
  const unregisteredApps = apps.filter(app => !microApps.some(registeredApp => registeredApp.name === app.name));

  microApps = [...microApps, ...unregisteredApps];

  unregisteredApps.forEach(app => {
    const { name, activeRule, props = {} } = app;

    registerApplication(name, () => loadApp(app, frameworkConfiguration, lifeCycles), activeRule, props);
  });
}

export function start(opts: Configuration = {}) {
  window.__POWERED_BY_QIANKUN__ = true;

  frameworkConfiguration = opts;
  const {
    prefetch = true,
    jsSandbox = true,
    singular = true,
    urlRerouteOnly,
    ...importEntryOpts
  } = frameworkConfiguration;

  if (prefetch) {
    prefetchApps(microApps, prefetch, importEntryOpts);
  }

  if (jsSandbox) {
    if (!window.Proxy) {
      console.warn('[qiankun] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox');
      // 快照沙箱不支持非 singular 模式
      if (!singular) {
        console.error('[qiankun] singular is forced to be true when jsSandbox enable but proxySandbox unavailable');
        frameworkConfiguration.singular = true;
      }
    }
  }

  startSingleSpa();

  frameworkStartedDefer.resolve();
}
