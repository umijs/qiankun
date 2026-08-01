import { ensureJQuerySupport } from "../jquery-support";
import {
  isActive,
  toName,
  shouldBeActive,
  InternalApplication,
  AppOrParcelStatus,
} from "./app.helpers";
import { reroute, triggerAppChange } from "../navigation/reroute";
import { toUnmountPromise } from "../lifecycles/unmount";
import {
  toUnloadPromise,
  getAppUnloadInfo,
  addAppToUnload,
} from "../lifecycles/unload";
import { formatErrorMessage } from "./app-errors";
import { isInBrowser } from "../utils/runtime-environment";
import { isStarted } from "../start";
import {
  Activity,
  ActivityFn,
  AppProps,
  Application,
  CustomProps,
  CustomPropsFn,
  LifeCycles,
  LoadApp,
  LoadedApp,
  RegisterApplicationConfig,
  SingleSpaLocation,
} from "../lifecycles/lifecycle.helpers";

const apps: InternalApplication[] = [];

interface AppChanges {
  appsToUnload: InternalApplication[];
  appsToUnmount: InternalApplication[];
  appsToLoad: InternalApplication[];
  appsToMount: InternalApplication[];
}

export function getAppChanges(): AppChanges {
  const appsToUnload: InternalApplication[] = [],
    appsToUnmount: InternalApplication[] = [],
    appsToLoad: InternalApplication[] = [],
    appsToMount: InternalApplication[] = [];

  // We re-attempt to download applications in LOAD_ERROR after a timeout of 200 milliseconds
  const currentTime: number = new Date().getTime();

  apps.forEach((app) => {
    const appShouldBeActive =
      app.status !== AppOrParcelStatus.SKIP_BECAUSE_BROKEN &&
      shouldBeActive(app);

    switch (app.status) {
      case AppOrParcelStatus.LOAD_ERROR:
        if (appShouldBeActive && currentTime - app.loadErrorTime >= 200) {
          appsToLoad.push(app);
        }
        break;
      case AppOrParcelStatus.NOT_LOADED:
      case AppOrParcelStatus.LOADING_SOURCE_CODE:
        if (appShouldBeActive) {
          appsToLoad.push(app);
        }
        break;
      case AppOrParcelStatus.NOT_INITIALIZED:
      case AppOrParcelStatus.NOT_MOUNTED:
        if (!appShouldBeActive && getAppUnloadInfo(toName(app))) {
          appsToUnload.push(app);
        } else if (appShouldBeActive) {
          appsToMount.push(app);
        }
        break;
      case AppOrParcelStatus.MOUNTED:
        if (!appShouldBeActive) {
          appsToUnmount.push(app);
        }
        break;
      // all other statuses are ignored
    }
  });

  return { appsToUnload, appsToUnmount, appsToLoad, appsToMount };
}

export function getMountedApps(): string[] {
  return apps.filter(isActive).map(toName);
}

export function getAppNames(): string[] {
  return apps.map(toName);
}

// used in devtools, not (currently) exposed as a single-spa API
export function getRawAppData(): InternalApplication[] {
  return [...apps];
}

export function getAppStatus(appName): AppOrParcelStatus | null {
  const app = apps.find((app) => toName(app) === appName);
  return app ? app.status : null;
}

let startWarningInitialized: boolean = false;

export function registerApplication<ExtraProps extends CustomProps = {}>(
  RegisterApplicationConfig,
): void;
export function registerApplication<ExtraProps extends CustomProps = {}>(
  appName: string,
  app: Application,
  activeWhen: Activity,
  customProps: ExtraProps | CustomPropsFn<ExtraProps>,
): void;
export function registerApplication<ExtraProps extends CustomProps = {}>(
  appNameOrConfig: string | RegisterApplicationConfig,
  appOrLoadApp?: Application,
  activeWhen?: Activity,
  customProps?: ExtraProps | CustomPropsFn<ExtraProps>,
): void {
  const registration = sanitizeArguments(
    appNameOrConfig,
    appOrLoadApp,
    activeWhen,
    customProps,
  );

  if (!isStarted() && !startWarningInitialized) {
    startWarningInitialized = true;

    setTimeout(() => {
      if (!isStarted()) {
        console.warn(
          formatErrorMessage(
            1,
            __DEV__ &&
              `singleSpa.start() has not been called, 5000ms after single-spa was loaded. Before start() is called, apps can be declared and loaded, but not initialized or mounted.`,
          ),
        );
      }
    }, 5000);
  }

  if (getAppNames().indexOf(registration.name) !== -1)
    throw Error(
      formatErrorMessage(
        21,
        __DEV__ &&
          `There is already an app registered with name ${registration.name}`,
        registration.name,
      ),
    );

  apps.push(
    Object.assign(
      {
        loadErrorTime: null,
        status: AppOrParcelStatus.NOT_LOADED,
        parcels: {},
        devtools: {
          overlays: {
            options: {},
            selectors: [],
          },
        },
      },
      registration,
    ),
  );

  if (isInBrowser) {
    ensureJQuerySupport();
    reroute();
  }
}

export function checkActivityFunctions(
  location: SingleSpaLocation = window.location,
): string[] {
  return apps.filter((app) => app.activeWhen(location)).map(toName);
}

export function unregisterApplication(appName: string): Promise<void> {
  if (apps.filter((app) => toName(app) === appName).length === 0) {
    throw Error(
      formatErrorMessage(
        25,
        __DEV__ &&
          `Cannot unregister application '${appName}' because no such application has been registered`,
        appName,
      ),
    );
  }

  const unloadPromise = isInBrowser
    ? // See https://github.com/single-spa/single-spa/issues/871 for why waitForUnmount is false
      unloadApplication(appName, { waitForUnmount: false })
    : Promise.resolve();

  return unloadPromise.then(() => {
    const appIndex = apps.map(toName).indexOf(appName);
    apps.splice(appIndex, 1);
  });
}

export function unloadApplication(
  appName: string,
  opts: { waitForUnmount: boolean } = { waitForUnmount: false },
): Promise<void> {
  if (typeof appName !== "string") {
    throw Error(
      formatErrorMessage(
        26,
        __DEV__ && `unloadApplication requires a string 'appName'`,
      ),
    );
  }
  const app = apps.find((app) => toName(app) === appName);
  if (!app) {
    throw Error(
      formatErrorMessage(
        27,
        __DEV__ &&
          `Could not unload application '${appName}' because no such application has been registered`,
        appName,
      ),
    );
  }

  const appUnloadInfo = getAppUnloadInfo(toName(app));
  if (opts?.waitForUnmount) {
    // We need to wait for unmount before unloading the app

    if (appUnloadInfo) {
      // Someone else is already waiting for this, too
      return appUnloadInfo.promise;
    } else {
      // We're the first ones wanting the app to be resolved.
      const promise = new Promise<void>((resolve, reject) => {
        addAppToUnload(app, () => promise, resolve, reject);
      });
      return promise;
    }
  } else {
    /* We should unmount the app, unload it, and remount it immediately.
     */

    let resultPromise;

    if (appUnloadInfo) {
      // Someone else is already waiting for this app to unload
      resultPromise = appUnloadInfo.promise;
      immediatelyUnloadApp(app, appUnloadInfo.resolve, appUnloadInfo.reject);
    } else {
      // We're the first ones wanting the app to be resolved.
      resultPromise = new Promise((resolve, reject) => {
        addAppToUnload(app, () => resultPromise, resolve, reject);
        immediatelyUnloadApp(app, resolve, reject);
      });
    }

    return resultPromise;
  }
}

function immediatelyUnloadApp(
  app: InternalApplication,
  resolve: (value?: any) => void,
  reject: (value?: any) => void,
): void {
  Promise.resolve()
    .then(() => {
      // Before unmounting the application, we first must wait for it to finish mounting
      // Otherwise, the test for issue 871 in unregister-application.spec.js fails because
      // the application isn't really unmounted.
      if (
        checkActivityFunctions().find((activeApp) => activeApp === toName(app))
      ) {
        return triggerAppChange();
      }
    })
    .then(() => {
      return toUnmountPromise(app as LoadedApp)
        .then(toUnloadPromise)
        .then(() => {
          resolve();
          setTimeout(() => {
            // reroute, but the unload promise is done
            reroute();
          });
        });
    })
    .catch(reject);
}

function validateRegisterWithArguments(
  name: string,
  appOrLoadApp: Application,
  activeWhen: Activity,
  customProps?: CustomProps | CustomPropsFn,
): void {
  if (typeof name !== "string" || name.length === 0)
    throw Error(
      formatErrorMessage(
        20,
        __DEV__ &&
          `The 1st argument to registerApplication must be a non-empty string 'appName'`,
      ),
    );

  if (!appOrLoadApp)
    throw Error(
      formatErrorMessage(
        23,
        __DEV__ &&
          "The 2nd argument to registerApplication must be an application or loading application function",
      ),
    );

  if (typeof activeWhen !== "function")
    throw Error(
      formatErrorMessage(
        24,
        __DEV__ &&
          "The 3rd argument to registerApplication must be an activeWhen function",
      ),
    );

  if (!validCustomProps(customProps))
    throw Error(
      formatErrorMessage(
        22,
        __DEV__ &&
          "The optional 4th argument is a customProps and must be an object",
      ),
    );
}

export function validateRegisterWithConfig(
  config: Partial<RegisterApplicationConfig>,
): void {
  if (Array.isArray(config) || config === null)
    throw Error(
      formatErrorMessage(
        39,
        __DEV__ && "Configuration object can't be an Array or null!",
      ),
    );
  const validKeys = ["name", "app", "activeWhen", "customProps"];
  const invalidKeys = Object.keys(config).reduce(
    (invalidKeys, prop) =>
      validKeys.indexOf(prop) >= 0 ? invalidKeys : invalidKeys.concat(prop),
    [],
  );
  if (invalidKeys.length !== 0)
    throw Error(
      formatErrorMessage(
        38,
        __DEV__ &&
          `The configuration object accepts only: ${validKeys.join(
            ", ",
          )}. Invalid keys: ${invalidKeys.join(", ")}.`,
        validKeys.join(", "),
        invalidKeys.join(", "),
      ),
    );
  if (typeof config.name !== "string" || config.name.length === 0)
    throw Error(
      formatErrorMessage(
        20,
        __DEV__ &&
          "The config.name on registerApplication must be a non-empty string",
      ),
    );
  if (typeof config.app !== "object" && typeof config.app !== "function")
    throw Error(
      formatErrorMessage(
        20,
        __DEV__ &&
          "The config.app on registerApplication must be an application or a loading function",
      ),
    );
  const allowsStringAndFunction = (activeWhen) =>
    typeof activeWhen === "string" || typeof activeWhen === "function";
  if (
    !allowsStringAndFunction(config.activeWhen) &&
    !(
      Array.isArray(config.activeWhen) &&
      config.activeWhen.every(allowsStringAndFunction)
    )
  )
    throw Error(
      formatErrorMessage(
        24,
        __DEV__ &&
          "The config.activeWhen on registerApplication must be a string, function or an array with both",
      ),
    );
  if (!validCustomProps(config.customProps))
    throw Error(
      formatErrorMessage(
        22,
        __DEV__ && "The optional config.customProps must be an object",
      ),
    );
}

function validCustomProps(customProps: unknown): boolean {
  return (
    !customProps ||
    typeof customProps === "function" ||
    (typeof customProps === "object" &&
      customProps !== null &&
      !Array.isArray(customProps))
  );
}

interface ApplicationRegistration {
  name: string;
  loadApp: LoadApp;
  activeWhen: ActivityFn;
  customProps?: CustomProps;
}

function sanitizeArguments<ExtraProps extends CustomProps = {}>(
  appNameOrConfig: string | RegisterApplicationConfig,
  appOrLoadApp: Application,
  activeWhen: Activity,
  customProps?: ExtraProps | CustomPropsFn<ExtraProps>,
): ApplicationRegistration {
  const usingObjectAPI = typeof appNameOrConfig === "object";

  let unsanitizedRegistration: {
    name: string;
    app: Application;
    activeWhen: Activity;
    customProps: CustomProps | CustomPropsFn<CustomProps>;
  };

  if (usingObjectAPI) {
    validateRegisterWithConfig(appNameOrConfig);
    unsanitizedRegistration = {
      name: appNameOrConfig.name,
      app: appNameOrConfig.app,
      activeWhen: appNameOrConfig.activeWhen,
      customProps: appNameOrConfig.customProps,
    };
  } else {
    validateRegisterWithArguments(
      appNameOrConfig,
      appOrLoadApp,
      activeWhen,
      customProps,
    );
    unsanitizedRegistration = {
      name: appNameOrConfig,
      app: appOrLoadApp,
      activeWhen,
      customProps,
    };
  }

  return {
    name: unsanitizedRegistration.name,
    loadApp: sanitizeLoadApp(unsanitizedRegistration.app),
    customProps: sanitizeCustomProps(unsanitizedRegistration.customProps),
    activeWhen: sanitizeActiveWhen(unsanitizedRegistration.activeWhen),
  };
}

function sanitizeLoadApp<ExtraProps extends CustomProps = {}>(
  loadApp: Application,
): (config: ExtraProps & AppProps) => Promise<LifeCycles<ExtraProps>> {
  if (typeof loadApp !== "function") {
    return () => Promise.resolve(loadApp);
  }

  return loadApp;
}

function sanitizeCustomProps(customProps?: CustomProps): CustomProps {
  return customProps ? customProps : {};
}

function sanitizeActiveWhen(activeWhen: Activity): ActivityFn {
  const activeWhenArray: (ActivityFn | string)[] = Array.isArray(activeWhen)
    ? activeWhen
    : [activeWhen];
  const activityFnArray: ActivityFn[] = activeWhenArray.map(
    (activeWhenOrPath) =>
      typeof activeWhenOrPath === "function"
        ? activeWhenOrPath
        : pathToActiveWhen(activeWhenOrPath, false),
  );

  return (location) =>
    activityFnArray.some((activeWhen) => activeWhen(location));
}

export function pathToActiveWhen(
  path: string,
  exactMatch?: boolean,
): ActivityFn {
  const regex = toDynamicPathValidatorRegex(path, exactMatch);

  return (location: Location) => {
    const route = location.href
      .replace(location.origin, "")
      .replace(location.search, "")
      .split("?")[0];
    return regex.test(route);
  };
}

function toDynamicPathValidatorRegex(path: string, exactMatch?: boolean) {
  let lastIndex: number = 0,
    inDynamic: boolean = false,
    regexStr: string = "^";

  if (path[0] !== "/") {
    path = "/" + path;
  }

  for (let charIndex = 0; charIndex < path.length; charIndex++) {
    const char = path[charIndex];
    const startOfDynamic = !inDynamic && char === ":";
    const endOfDynamic = inDynamic && char === "/";
    if (startOfDynamic || endOfDynamic) {
      appendToRegex(charIndex);
    }
  }

  appendToRegex(path.length);
  return new RegExp(regexStr, "i");

  function appendToRegex(index) {
    const anyCharMaybeTrailingSlashRegex = "[^/]+/?";
    const commonStringSubPath = escapeStrRegex(path.slice(lastIndex, index));

    regexStr += inDynamic
      ? anyCharMaybeTrailingSlashRegex
      : commonStringSubPath;

    if (index === path.length) {
      if (inDynamic) {
        if (exactMatch) {
          // Ensure exact match paths that end in a dynamic portion don't match
          // urls with characters after a slash after the dynamic portion.
          regexStr += "$";
        }
      } else {
        // For exact matches, expect no more characters. Otherwise, allow
        // any characters.
        const suffix = exactMatch ? "" : ".*";

        regexStr =
          // use charAt instead as we could not use es6 method endsWith
          regexStr.charAt(regexStr.length - 1) === "/"
            ? `${regexStr}${suffix}$`
            : `${regexStr}(/${suffix})?(#.*)?$`;
      }
    }

    inDynamic = !inDynamic;
    lastIndex = index;
  }

  function escapeStrRegex(str) {
    // borrowed from https://github.com/sindresorhus/escape-string-regexp/blob/master/index.js
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
  }
}
