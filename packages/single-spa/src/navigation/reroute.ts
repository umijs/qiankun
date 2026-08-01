import { isStarted } from "../start";
import { toLoadPromise } from "../lifecycles/load";
import { toInitPromise } from "../lifecycles/init";
import { toMountPromise } from "../lifecycles/mount";
import { toUnmountPromise } from "../lifecycles/unmount";
import {
  getAppStatus,
  getAppChanges,
  getMountedApps,
} from "../applications/apps";
import {
  callCapturedEventListeners,
  originalReplaceState,
} from "./navigation-events";
import { toUnloadPromise } from "../lifecycles/unload";
import {
  toName,
  shouldBeActive,
  AppOrParcelStatus,
  InternalApplication,
} from "../applications/app.helpers";
import { isInBrowser } from "../utils/runtime-environment";
import { formatErrorMessage } from "../applications/app-errors";
import { ProfileEntry, addProfileEntry } from "../devtools/profiler";
import { LoadedApp } from "../lifecycles/lifecycle.helpers";

type EventArguments = [HashChangeEvent | PopStateEvent];

interface WaitingPromises {
  resolve(value: unknown): void;
  reject(value: unknown): void;
  eventArguments?: [HashChangeEvent | PopStateEvent];
}

let appChangeUnderway: boolean = false,
  promisesWaitingOnAppChange: WaitingPromises[] = [],
  currentUrl = isInBrowser && window.location.href;

export function triggerAppChange() {
  // Call reroute with no arguments, intentionally
  return reroute();
}

export function reroute(
  pendingPromises: WaitingPromises[] = [],
  eventArguments: EventArguments = undefined,
  silentNavigation: boolean = false,
): Promise<string[]> {
  if (appChangeUnderway) {
    return new Promise((resolve, reject) => {
      promisesWaitingOnAppChange.push({
        resolve,
        reject,
        eventArguments,
      });
    });
  }

  let startTime: number, profilerKind: ProfileEntry["kind"];

  if (__PROFILE__) {
    startTime = performance.now();
    if (silentNavigation) {
      profilerKind = "silentNavigation";
    } else if (eventArguments) {
      profilerKind = "browserNavigation";
    } else {
      profilerKind = "triggerAppChange";
    }
  }

  const { appsToUnload, appsToUnmount, appsToLoad, appsToMount } =
    getAppChanges();
  let appsThatChanged: InternalApplication[],
    cancelPromises: Promise<unknown>[] = [],
    oldUrl: string = currentUrl,
    newUrl: string = (currentUrl = window.location.href);

  if (isStarted()) {
    appChangeUnderway = true;
    appsThatChanged = appsToUnload.concat(
      appsToLoad,
      appsToUnmount,
      appsToMount,
    );
    return performAppChanges();
  } else {
    appsThatChanged = appsToLoad;
    return loadApps();
  }

  function cancelNavigation(val: boolean | Promise<boolean> = true) {
    const promise: Promise<boolean> =
      typeof (val as Promise<boolean>)?.then === "function"
        ? (val as Promise<boolean>)
        : Promise.resolve(val);
    cancelPromises.push(
      promise.catch((err) => {
        console.warn(
          Error(
            formatErrorMessage(
              42,
              __DEV__ &&
                `single-spa: A cancelNavigation promise rejected with the following value: ${err}`,
            ),
          ),
        );
        console.warn(err);

        // Interpret a Promise rejection to mean that the navigation should not be canceled
        return false;
      }),
    );
  }

  function loadApps(): Promise<string[]> {
    return Promise.resolve().then(() => {
      const loadPromises = appsToLoad.map(toLoadPromise);
      let succeeded: boolean;

      return (
        Promise.all(loadPromises)
          .then(callAllEventListeners)
          // there are no mounted apps, before start() is called, so we always return []
          .then(() => {
            if (__PROFILE__) {
              succeeded = true;
            }

            return [];
          })
          .catch((err) => {
            if (__PROFILE__) {
              succeeded = false;
            }

            callAllEventListeners();
            throw err;
          })
          .finally(() => {
            if (__PROFILE__) {
              addProfileEntry(
                "routing",
                "loadApps",
                profilerKind,
                startTime,
                performance.now(),
                succeeded,
              );
            }
          })
      );
    });
  }

  function performAppChanges(): Promise<string[]> {
    return Promise.resolve().then(() => {
      // https://github.com/single-spa/single-spa/issues/545
      fireSingleSpaEvent(
        appsThatChanged.length === 0
          ? "before-no-app-change"
          : "before-app-change",
        getCustomEventDetail(true),
      );

      fireSingleSpaEvent(
        "before-routing-event",
        getCustomEventDetail(true, { cancelNavigation }),
      );

      return Promise.all(cancelPromises).then((cancelValues) => {
        const navigationIsCanceled: boolean = cancelValues.some((v) => v);

        if (navigationIsCanceled) {
          // Change url back to old url, without triggering the normal single-spa reroute
          originalReplaceState.call(
            window.history,
            history.state,
            "",
            oldUrl.substring(location.origin.length),
          );

          // Single-spa's internal tracking of current url needs to be updated after the url change above
          currentUrl = location.href;

          // necessary for the reroute function to know that the current reroute is finished
          appChangeUnderway = false;

          if (__PROFILE__) {
            addProfileEntry(
              "routing",
              "navigationCanceled",
              profilerKind,
              startTime,
              performance.now(),
              true,
            );
          }

          // Tell single-spa to reroute again, this time with the url set to the old URL
          return reroute(pendingPromises, eventArguments, true);
        }

        const unloadPromises: Promise<InternalApplication>[] =
          appsToUnload.map(toUnloadPromise);

        const unmountUnloadPromises = (appsToUnmount as LoadedApp[])
          .map((app) => toUnmountPromise(app))
          .map((unmountPromise: Promise<LoadedApp>) =>
            unmountPromise.then(toUnloadPromise),
          );

        const allUnmountPromises: Promise<InternalApplication>[] = [
          ...unmountUnloadPromises,
          ...unloadPromises,
        ];

        const unmountAllPromise = Promise.all(allUnmountPromises);

        let unmountFinishedTime: number;

        unmountAllPromise.then(
          () => {
            if (__PROFILE__) {
              unmountFinishedTime = performance.now();

              addProfileEntry(
                "routing",
                "unmountAndUnload",
                profilerKind,
                startTime,
                performance.now(),
                true,
              );
            }
            fireSingleSpaEvent(
              "before-mount-routing-event",
              getCustomEventDetail(true),
            );
          },
          (err) => {
            if (__PROFILE__) {
              addProfileEntry(
                "routing",
                "unmountAndUnload",
                profilerKind,
                startTime,
                performance.now(),
                true,
              );
            }

            throw err;
          },
        );

        /* We load and init apps while other apps are unmounting, but we
         * wait to mount the app until all apps are finishing unmounting
         */
        const loadThenMountPromises: Promise<InternalApplication>[] =
          appsToLoad.map((app) => {
            return toLoadPromise(app).then((app) =>
              tryToInitAndMount(app, unmountAllPromise),
            );
          });

        /* These are the apps that are already initialized and just need
         * to be mounted. They each wait for all unmounting apps to finish up
         * before they mount.
         */
        const mountPromises: Promise<InternalApplication>[] = appsToMount
          .filter((appToMount) => !appsToLoad.includes(appToMount))
          .map((appToMount) => {
            return tryToInitAndMount(appToMount, unmountAllPromise);
          });
        return unmountAllPromise
          .catch((err) => {
            callAllEventListeners();
            throw err;
          })
          .then(() => {
            /* Now that the apps that needed to be unmounted are unmounted, their DOM navigation
             * events (like hashchange or popstate) should have been cleaned up. So it's safe
             * to let the remaining captured event listeners to handle about the DOM event.
             */
            callAllEventListeners();

            return Promise.all(loadThenMountPromises.concat(mountPromises))
              .catch((err) => {
                pendingPromises.forEach((promise) => promise.reject(err));
                throw err;
              })
              .then(
                () => {
                  if (__PROFILE__) {
                    addProfileEntry(
                      "routing",
                      "loadAndMount",
                      profilerKind,
                      unmountFinishedTime,
                      performance.now(),
                      true,
                    );
                  }
                },
                (err) => {
                  if (__PROFILE__) {
                    addProfileEntry(
                      "routing",
                      "loadAndMount",
                      profilerKind,
                      unmountFinishedTime,
                      performance.now(),
                      false,
                    );
                  }

                  throw err;
                },
              )
              .then(finishUpAndReturn);
          });
      });
    });
  }

  function finishUpAndReturn(): string[] {
    const returnValue = getMountedApps();
    pendingPromises.forEach((promise) => promise.resolve(returnValue));

    try {
      const appChangeEventName =
        appsThatChanged.length === 0 ? "no-app-change" : "app-change";
      fireSingleSpaEvent(appChangeEventName, getCustomEventDetail());
      fireSingleSpaEvent("routing-event", getCustomEventDetail());
    } catch (err) {
      /* We use a setTimeout because if someone else's event handler throws an error, single-spa
       * needs to carry on. If a listener to the event throws an error, it's their own fault, not
       * single-spa's.
       */
      setTimeout(() => {
        throw err;
      });
    }

    /* Setting this allows for subsequent calls to reroute() to actually perform
     * a reroute instead of just getting queued behind the current reroute call.
     * We want to do this after the mounting/unmounting is done but before we
     * resolve the promise for the `reroute` function.
     */
    appChangeUnderway = false;

    if (promisesWaitingOnAppChange.length > 0) {
      /* While we were rerouting, someone else triggered another reroute that got queued.
       * So we need reroute again.
       */
      const nextPendingPromises = promisesWaitingOnAppChange;
      promisesWaitingOnAppChange = [];
      reroute(nextPendingPromises);
    }

    return returnValue;
  }

  /* We need to call all event listeners that have been delayed because they were
   * waiting on single-spa. This includes haschange and popstate events for both
   * the current run of performAppChanges(), but also all of the queued event listeners.
   * We want to call the listeners in the same order as if they had not been delayed by
   * single-spa, which means queued ones first and then the most recent one.
   */
  function callAllEventListeners() {
    // During silent navigation (when navigation was canceled and we're going back to the old URL),
    // we should not fire any popstate / hashchange events
    if (!silentNavigation) {
      pendingPromises.forEach((pendingPromise) => {
        callCapturedEventListeners(pendingPromise.eventArguments);
      });

      callCapturedEventListeners(eventArguments);
    }
  }

  function getCustomEventDetail(
    isBeforeChanges: boolean = false,
    extraProperties?: Object,
  ): CustomEventInit {
    const newAppStatuses = {};
    const appsByNewStatus = {
      // for apps that were mounted
      [AppOrParcelStatus.MOUNTED]: [],
      // for apps that were unmounted
      [AppOrParcelStatus.NOT_MOUNTED]: [],
      // apps that were forcibly unloaded
      [AppOrParcelStatus.NOT_LOADED]: [],
      // apps that attempted to do something but are broken now
      [AppOrParcelStatus.SKIP_BECAUSE_BROKEN]: [],
    };

    if (isBeforeChanges) {
      appsToLoad.concat(appsToMount).forEach((app, index) => {
        addApp(app, AppOrParcelStatus.MOUNTED);
      });
      appsToUnload.forEach((app) => {
        addApp(app, AppOrParcelStatus.NOT_LOADED);
      });
      appsToUnmount.forEach((app) => {
        addApp(app, AppOrParcelStatus.NOT_MOUNTED);
      });
    } else {
      appsThatChanged.forEach((app) => {
        addApp(app);
      });
    }

    const result = {
      detail: {
        newAppStatuses,
        appsByNewStatus,
        totalAppChanges: appsThatChanged.length,
        originalEvent: eventArguments?.[0],
        oldUrl,
        newUrl,
      },
    };

    if (extraProperties) {
      Object.assign(result.detail, extraProperties);
    }

    return result;

    function addApp(
      app: InternalApplication,
      status?: InternalApplication["status"],
    ) {
      const appName = toName(app);
      status = status || getAppStatus(appName);
      newAppStatuses[appName] = status;
      const statusArr = (appsByNewStatus[status] =
        appsByNewStatus[status] || []);
      statusArr.push(appName);
    }
  }

  function fireSingleSpaEvent(name: string, eventProperties: CustomEventInit) {
    // During silent navigation (caused by navigation cancelation), we should not
    // fire any single-spa events
    if (!silentNavigation) {
      window.dispatchEvent(
        new CustomEvent(`single-spa:${name}`, eventProperties),
      );
    }
  }
}

/**
 * Let's imagine that some kind of delay occurred during application loading.
 * The user without waiting for the application to load switched to another route,
 * this means that we shouldn't initialize and mount that application, thus we check
 * twice if that application should be active before initialize and mounting.
 * https://github.com/single-spa/single-spa/issues/524
 */
function tryToInitAndMount(
  app: InternalApplication,
  unmountAllPromise: Promise<unknown>,
): Promise<InternalApplication> {
  if (shouldBeActive(app)) {
    return toInitPromise(app as LoadedApp).then((app) =>
      unmountAllPromise.then(() =>
        shouldBeActive(app) ? toMountPromise(app) : app,
      ),
    ) as Promise<InternalApplication>;
  } else {
    return unmountAllPromise.then(() => app);
  }
}
