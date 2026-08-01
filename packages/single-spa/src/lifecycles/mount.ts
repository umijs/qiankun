import {
  toName,
  isParcel,
  AppOrParcelStatus,
} from "../applications/app.helpers";
import { handleAppError, transformErr } from "../applications/app-errors";
import { reasonableTime } from "../applications/timeouts";
import { toUnmountPromise } from "./unmount";
import { ProfileEntry, addProfileEntry } from "../devtools/profiler";
import { LoadedAppOrParcel } from "./lifecycle.helpers";

let beforeFirstMountFired: boolean = false;
let firstMountFired: boolean = false;

export function toMountPromise(
  appOrParcel: LoadedAppOrParcel,
  hardFail?: boolean,
): Promise<LoadedAppOrParcel> {
  return Promise.resolve().then(() => {
    if (appOrParcel.status !== AppOrParcelStatus.NOT_MOUNTED) {
      return appOrParcel;
    }

    let startTime: number, profileEventType: ProfileEntry["type"];

    if (__PROFILE__) {
      profileEventType = isParcel(appOrParcel) ? "parcel" : "application";
      startTime = performance.now();
    }

    if (!beforeFirstMountFired) {
      window.dispatchEvent(new CustomEvent("single-spa:before-first-mount"));
      beforeFirstMountFired = true;
    }

    appOrParcel.status = AppOrParcelStatus.MOUNTING;

    return reasonableTime(appOrParcel, "mount")
      .then(() => {
        appOrParcel.status = AppOrParcelStatus.MOUNTED;

        if (!firstMountFired) {
          window.dispatchEvent(new CustomEvent("single-spa:first-mount"));
          firstMountFired = true;
        }

        if (__PROFILE__) {
          addProfileEntry(
            profileEventType,
            toName(appOrParcel),
            "mount",
            startTime,
            performance.now(),
            true,
          );
        }

        return appOrParcel;
      })
      .catch((err) => {
        // If we fail to mount the appOrParcel, we should attempt to unmount it before putting in SKIP_BECAUSE_BROKEN
        // We temporarily put the appOrParcel into MOUNTED status so that toUnmountPromise actually attempts to unmount it
        // instead of just doing a no-op.
        appOrParcel.status = AppOrParcelStatus.MOUNTED;
        return toUnmountPromise(appOrParcel, true).then(
          setSkipBecauseBroken,
          setSkipBecauseBroken,
        );

        function setSkipBecauseBroken() {
          if (__PROFILE__) {
            addProfileEntry(
              profileEventType,
              toName(appOrParcel),
              "mount",
              startTime,
              performance.now(),
              false,
            );
          }

          if (!hardFail) {
            handleAppError(
              err,
              appOrParcel,
              AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
            );
            return appOrParcel;
          } else {
            throw transformErr(
              err,
              appOrParcel,
              AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
            );
          }
        }
      });
  });
}
