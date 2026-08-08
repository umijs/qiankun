import { Deferred } from '@qiankunjs/shared';
import { noop } from 'lodash';
import type { StartOpts } from '@qiankunjs/single-spa';
import { registerApplication, start as startSingleSpa } from '@qiankunjs/single-spa';
import loadApp from '../core/loadApp';
import type { AppConfiguration, LifeCycles, ObjectType, RegistrableApp } from '../types';

export let started = false;

export const microApps: Array<RegistrableApp<Record<string, unknown>>> = [];
const frameworkConfiguration: AppConfiguration = {};

const frameworkStartedDefer = new Deferred<void>();

export function registerMicroApps<T extends ObjectType>(apps: Array<RegistrableApp<T>>, lifeCycles?: LifeCycles<T>) {
  // Each app only needs to be registered once
  const unregisteredApps = apps.filter((app) => !microApps.some((registeredApp) => registeredApp.name === app.name));

  microApps.push(...unregisteredApps);

  unregisteredApps.forEach((app) => {
    const { name, activeRule, loader = noop, props, entry, container, configuration } = app;

    registerApplication({
      name,
      app: async () => {
        loader(true);
        await frameworkStartedDefer.promise;

        // The loader indicator hooks live INSIDE loadApp's mount chain: appended out here they
        // would run within the container hold ② but outside its failure fallback, and a throwing
        // indicator would leak the hold forever (single-spa never runs a broken app's chains).
        return (
          await loadApp(
            { name, entry, container, props, loader },
            { ...frameworkConfiguration, ...configuration },
            lifeCycles,
          )
        )(container);
      },
      activeWhen: activeRule,
      customProps: props,
    });
  });
}

export function start(opts: StartOpts = {}) {
  if (!started) {
    // frameworkConfiguration = { prefetch: true, singular: true, sandbox: true, ...opts };
    // const { prefetch, urlRerouteOnly = defaultUrlRerouteOnly, ...importEntryOpts } = frameworkConfiguration;

    // if (prefetch) {
    //   doPrefetchStrategy(microApps, prefetch, importEntryOpts);
    // }

    // frameworkConfiguration = autoDowngradeForLowVersionBrowser(frameworkConfiguration);

    startSingleSpa(opts);
    started = true;

    frameworkStartedDefer.resolve();
  }
}
